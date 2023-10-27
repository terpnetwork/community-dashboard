import { useWallet } from 'contexts/wallet'
import { useCallback, useEffect, useState } from 'react'

import type { HeadstashAirdropContract, HeadstashAirdropInstance, HeadstashAirdropMessages } from './contract'
import { HeadstashAirdrop as initContract } from './contract'

interface InstantiateResponse {
  readonly contractAddress: string
  readonly transactionHash: string
}

export interface UseHeadstashAirdropContractProps {
  instantiate: (
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string,
  ) => Promise<InstantiateResponse>
  use: (customAddress: string) => HeadstashAirdropInstance | undefined
  updateContractAddress: (contractAddress: string) => void
  messages: () => HeadstashAirdropMessages | undefined
}

export function useHeadstashAirdropContract(): UseHeadstashAirdropContractProps {
  const wallet = useWallet()

  const [address, setAddress] = useState<string>('')
  const [HeadstashAirdrop, setHeadstashAirdrop] = useState<HeadstashAirdropContract>()

  useEffect(() => {
    setAddress(localStorage.getItem('contract_address') || '')
  }, [])

  useEffect(() => {
    const client = wallet.getClient()
    if (!client) return
    const headstashAirdropContract = initContract(client, wallet.address)
    setHeadstashAirdrop(headstashAirdropContract)
  }, [wallet])

  const updateContractAddress = (contractAddress: string) => {
    setAddress(contractAddress)
  }

  const instantiate = useCallback(
    (codeId: number, initMsg: Record<string, unknown>, label: string, admin?: string): Promise<InstantiateResponse> => {
      return new Promise((resolve, reject) => {
        if (!HeadstashAirdrop) {
          reject(new Error('Contract is not initialized.'))
          return
        }
        HeadstashAirdrop.instantiate(wallet.address, codeId, initMsg, label, admin).then(resolve).catch(reject)
      })
    },
    [HeadstashAirdrop, wallet],
  )

  const use = useCallback(
    (customAddress = ''): HeadstashAirdropInstance | undefined => {
      return HeadstashAirdrop?.use(address || customAddress)
    },
    [HeadstashAirdrop, address],
  )

  const messages = useCallback((): HeadstashAirdropMessages | undefined => {
    return HeadstashAirdrop?.messages()
  }, [HeadstashAirdrop])

  return {
    instantiate,
    use,
    updateContractAddress,
    messages,
  }
}
