import React, { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

import toast from 'react-hot-toast'
import { getShortAddress } from 'utils/getShortAddress'
import { WalletService } from '@/services/wallet.service'
import { initialThrowawayDetails, ThrowawayWallet } from '@/utils/headstash'

interface MetamaskConnectButtonProps {
  handleEthPubkey: (eth_pubkey: string) => void
}

const ethereum = (window as any).ethereum

const MetamaskConnectButton: React.FC<MetamaskConnectButtonProps> = ({ handleEthPubkey }) => {
  const [eth_pubkey, setEthPubkey] = useState<string>('')
  const { status, address } = useAccount()
  const { disconnect } = useDisconnect()

  const connectWallet = async () => {
    if (ethereum && status !== 'connected') {
      const addressArray = await ethereum.request({
        method: 'eth_requestAccounts'
      })
      const obj = {
        address: addressArray[0]
      }
      return obj
    } else if (status == 'connected') {
      setEthPubkey(address)
    } else {
      throw new Error('You must install Metamask, a virtual Ethereum wallet, in your browser.')
    }
  }

  const walletConnectHandler = async () => {
    try {
      const walletResponse = await connectWallet()
      setEthPubkey(walletResponse.address)
    } catch (e) {
      console.log(e)
    }
  }

  const walletDisconnectHandler = async () => {
    try {
      await disconnect()
      setEthPubkey('')
    } catch (e) {
      toast.error(`${e}`)
    }
  }

  const addWalletListener = () => {
    if (ethereum) {
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setEthPubkey(accounts[0])
        } else {
          setEthPubkey('')
        }
      })
    } else {
      throw Error('You must install Metamask, a virtual Ethereum wallet, in your browser.')
    }
  }

  useEffect(() => {
    addWalletListener()
    handleEthPubkey(eth_pubkey)
  }, [eth_pubkey, handleEthPubkey])

  return (
    <div>
      {eth_pubkey != '' ? (
        <button
          style={{}}
          className="text-white block my-6 p-3 w-full text-center font-semibold bg-cyan-600 dark:bg-cyan-600 rounded-lg text-sm hover:bg-cyan-500 dark:hover:bg-cyan-500 focus:bg-cyan-600 dark:focus:bg-cyan-600 transition-colors"
          onClick={walletDisconnectHandler}
        >
          {getShortAddress(eth_pubkey)}
        </button>
      ) : (
        <button
          style={{}}
          className="text-white block my-6 p-3 w-full text-center font-semibold bg-cyan-600 dark:bg-cyan-600 rounded-lg text-sm hover:bg-cyan-500 dark:hover:bg-cyan-500 focus:bg-cyan-600 dark:focus:bg-cyan-600 transition-colors"
          onClick={walletConnectHandler}
        >
          {eth_pubkey.length > 0 ? (
            `${eth_pubkey.substring(0, 6)}...${eth_pubkey.substring(38)}`
          ) : (
            <span>Connect Metamask</span>
          )}
        </button>
      )}
    </div>
  )
}

export default MetamaskConnectButton
