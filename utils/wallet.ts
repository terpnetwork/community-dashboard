import { NETWORK } from '@/lib/utils'
import { useChain as useCosmosKitChain } from '@cosmos-kit/react'
import { chains } from 'chain-registry'
import { getConfig } from 'config'
import { fromBech32 } from '@cosmjs/encoding'

/**
 * Hook to retrieve the wallet for the current chain.
 */
export const useWallet = () => {
  const { chainId } = getConfig(NETWORK!)
  const chain = chains.find((c) => c.chain_id === chainId)
  if (!chain) {
    throw new Error('Chain not found')
  }

  return useCosmosKitChain(chain.chain_name)
}

export const isValidBech32Address = (
  address: string,
  // If passed, the prefix must match this value.
  prefix?: string,
  // If passed, the address must contain this many bytes.
  length?: number
): boolean => {
  try {
    const decoded = fromBech32(address)

    if (prefix && decoded.prefix !== prefix) {
      return false
    }

    if (length !== undefined && decoded.data.length !== length) {
      return false
    }

    return true
  } catch (err) {
    return false
  }
}