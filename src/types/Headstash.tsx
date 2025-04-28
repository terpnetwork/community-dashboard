export type FetchAmountState = 'loading' | 'no_allocation' | 'amounts_fetched' | 'not_fetched_yet'

export interface SigDetails {
  message: string
  signatureHash: any
  address: string
  timestamp: string
}

export type HeadstashItem = {
  contract: string
  amount: number
}

export type HeadstashAllocation = {
  address: string
  headstash: HeadstashItem[]
}

export type HeadstashAllocations = HeadstashAllocation[]

export const initialAmountDetails: HeadstashAllocation = {
  address: '',
  headstash: []
}

export const initialSigDetails: SigDetails = {
  message: '',
  signatureHash: null,
  address: '',
  timestamp: ''
}

export interface ThrowawayWallet {
  mnemonic: string // base64 encoded privkey
  pubkey: string
}

export const initialThrowawayDetails: ThrowawayWallet = {
  mnemonic: '',
  pubkey: ''
}
