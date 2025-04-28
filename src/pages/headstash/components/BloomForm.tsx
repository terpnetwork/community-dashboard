import { useFormik } from 'formik'

import { Chain } from '@/utils/config'
import { IbcMode } from '@/types/IbcMode'
import { useSecretNetworkClientStore } from '@/store/secretNetworkClient'
import { IbcService } from '@/services/ibc.service'
import { ibcSchema } from '@/pages/ibc/components/ibcSchema'
import { NotificationService } from '@/services/notification.service'
import { HeadstashService } from '@/services/headstash.service'
import BloomMsg from './BloomComponent'
import { HeadstashItem } from '@/types/Headstash'
import { headstashCodeHash, headstashContract } from '@/utils/headstash'
import { useEffect, useState } from 'react'
import { Nullable } from '@/types/Nullable'
import toast from 'react-hot-toast'

interface IFormValues {
  chain: Chain
  ibcMode: IbcMode
}

export default function BloomForm() {
  const {
    amountDetails,
    secretNetworkClient,
    feeGrantStatus,
    walletAddress,
    ethPubkey,
    solPubkey,
    unEncryptedOfflineSig
  } = useSecretNetworkClientStore()
  const selectableChains = IbcService.getSupportedChains()
  const [ibcBloomItems, setIbcBloomItems] = useState<Nullable<HeadstashItem>[]>([])

  useEffect(() => {
    // reset state on wallet disconnect
    if (!unEncryptedOfflineSig) {
      setIbcBloomItems([])
    }
  }, [unEncryptedOfflineSig])

  const formik = useFormik<IFormValues>({
    initialValues: {
      chain: selectableChains.find((chain: Chain) => chain.chain_name === 'TerpNetTestNet'),
      ibcMode: 'ibc-bloom'
    },
    validationSchema: ibcSchema,
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        console.log(values)
        HeadstashService.performIbcBloom({
          ibcMode: values.ibcMode,
          chain: values.chain,
          addr: headstashContract,
          secretNetworkClient,
          codeHash: headstashCodeHash,
          bloomerPubKey: getPubkey(),
          bloomerOfflineSig: unEncryptedOfflineSig,
          amountDetails: amountDetails.headstash,
          feeGrantStatus
        })
      } catch (error: any) {
        console.error(error)
        NotificationService.notify(`Transfer unsuccessful!`, 'error')
      }
    }
  })

  function getPubkey() {
    return ethPubkey !== '' ? ethPubkey : solPubkey
  }

  function deleteIbcBloomContent(index: number): void {
    if (ibcBloomItems.length > 1 && index >= 0 && index < ibcBloomItems.length) {
      // Create a new array without the objects at the specified index
      const updatedMessages = [...ibcBloomItems.slice(0, index), ...ibcBloomItems.slice(index + 1)]
      // Update the state with the new array
      setIbcBloomItems(updatedMessages)
    } else {
      setIbcBloomItems([])
    }
  }

  const updateIbcBloomContent = (newIbcBloomsMsgItem: HeadstashItem, eligibleAmount: number) => {
    setIbcBloomItems((currentMessages) => {
      // Find the existing message with the same contract address
      const existingMessageIndex = currentMessages.findIndex(
        (message) => message.contract === newIbcBloomsMsgItem.contract
      )

      // If an existing message is found, update its amount
      if (existingMessageIndex !== -1) {
        const updatedMessages = currentMessages.map((message, i) =>
          i === existingMessageIndex ? { ...message, amount: newIbcBloomsMsgItem.amount } : message
        )

        return updatedMessages
      } else {
        // If no existing message is found, add a new message to the array
        return [...currentMessages, newIbcBloomsMsgItem]
      }
    })
  }

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full flex flex-col gap-4 text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800"
      >
        <div className="text-neutral-400 dark:text-neutral-500 text-sm font-semibold mb-0.5"></div>
        {/* For each token included in headstash, 
                the amount and destination addr are set to formik state.*/}
        {amountDetails.headstash &&
          amountDetails.headstash.map((item: HeadstashItem, index: number) => (
            <BloomMsg
              number={index + 1}
              onDelete={() => deleteIbcBloomContent(index)}
              prefix={null}
              snipAddr={item.contract}
              totalAmount={item.amount}
              updateIbcBloomContent={(headstash: HeadstashItem) => updateIbcBloomContent(headstash, item.amount)}
              unEncryptedOfflineSig={unEncryptedOfflineSig}
              scrtWallet={walletAddress}
            />
          ))}

        <button
          type="submit"
          className="text-white block my-6 p-3 w-full text-center font-semibold bg-cyan-600 dark:bg-cyan-600 rounded-lg text-sm hover:bg-cyan-500 dark:hover:bg-cyan-500 focus:bg-cyan-600 dark:focus:bg-cyan-600 transition-colors"
          style={{ filter: unEncryptedOfflineSig ? 'none' : 'blur(5px)' }}
          disabled={!walletAddress || !unEncryptedOfflineSig}
        >
          IBC Bloom
        </button>
      </form>
    </>
  )
}
