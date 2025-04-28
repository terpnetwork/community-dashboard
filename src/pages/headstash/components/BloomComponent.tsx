import PercentagePicker from '@/components/PercentagePicker'
import { IbcService } from '@/services/ibc.service'
import { useSecretNetworkClientStore } from '@/store/secretNetworkClient'
import { HeadstashItem } from '@/types/Headstash'
import { IbcMode } from '@/types/IbcMode'
import { Nullable } from '@/types/Nullable'
import { Chain } from '@/utils/config'
import { faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from '@mui/material'
import { useFormik } from 'formik'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Select, { components, InputActionMeta } from 'react-select'
import { SecretNetworkClient } from 'secretjs'

interface BloomMsgProps {
  number: number
  onDelete: () => void
  prefix: string | null
  snipAddr: string
  totalAmount: number
  updateIbcBloomContent: (contract: HeadstashItem) => void
  unEncryptedOfflineSig: string
  scrtWallet: string
}

const BloomMsg: React.FC<BloomMsgProps> = ({
  number,
  onDelete,
  prefix,
  snipAddr,
  totalAmount,
  updateIbcBloomContent,
  unEncryptedOfflineSig,
  scrtWallet
}) => {
  const [amount, setAmount] = useState<Nullable<number>>(0)
  const [confirmed, setConfirmed] = useState<Nullable<number>>(0)
  const selectableChains = IbcService.getSupportedChains()

  const onSelectAmountByPercentage = (selectedPercent: number) => {
    // multiply selected amount, or totalAmount, with selected %.
    let bloomAmount = ((totalAmount as undefined as number) * selectedPercent) / 100

    // push selected msg up through component types
    setAmount(bloomAmount)
  }

  const addHeadstash = () => {
    if (amount != 0) {
      let bloomMsg: HeadstashItem = { contract: snipAddr, amount: amount }
      updateIbcBloomContent(bloomMsg)
    }
  }

  return (
    <div>
      <div className="inline-flex items-center justify-center w-full">
        <div className="inline-flex items-center gap-2 select-none px-3 text-black bg-white dark:text-white dark:bg-neutral-900 text-sm font-bold">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 mt-3">Token #{snipAddr}</div>
          <div className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-neutral-700" />
          <div className="flex items-center gap-1.5">
            <PercentagePicker setAmountByPercentage={onSelectAmountByPercentage} />
            <span className="font-bold">{`Balance: `}</span>
            <span className="font-bold">{(amount / 1000000).toFixed(6)}</span>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 mt-3"></div>
          </div>
          <button onClick={addHeadstash} className="flex-1 text-xs">
            Confirm
          </button>
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default BloomMsg
