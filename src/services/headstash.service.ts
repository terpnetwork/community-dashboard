import { IbcMode } from '@/types/IbcMode'
import { Chain, chains } from '@/utils/config'
import { axios } from 'context/axios'
import { IbcService } from './ibc.service'
import { BroadcastMode, SecretNetworkClient, TxResponse } from 'secretjs'
import { HeadstashItem } from '@/types/Headstash'
import { FeeGrantStatus } from '@/types/FeeGrantStatus'
import { faucetAddress } from '@/utils/commons'

export interface HProps {
  // headstash props
  ibcMode: IbcMode
  chain: Chain
  addr: string
  secretNetworkClient: SecretNetworkClient
  codeHash: string
  bloomerPubKey: string
  bloomerOfflineSig: string
  amountDetails: HeadstashItem[]
  feeGrantStatus: FeeGrantStatus
}

export class HeadstashAmountService {
  static async requestProofs(address: string): Promise<HeadstashAmountResponse> {
    const { data } = await axios.get(`/getAmount/${address}`)
    return data
  }
}

export class HeadstashProofsService {
  static async requestProofs(address: string): Promise<ProofsResponse> {
    const { data } = await axios.get(`/getProofs/${address}`)
    return data
  }
}

export interface ProofsResponse {
  proofs: string[]
}

export interface HeadstashAmountResponse {
  amount: string
}

async function broadcastIbcBloom(props: HProps, sourceChainNetworkClient: SecretNetworkClient): Promise<string> {
  const selectedDest: Chain = chains[props.chain.chain_name]

  let { withdraw_channel_id, withdraw_gas } = selectedDest // todo: grab channel from props

  try {
    let tx: TxResponse
    tx = await props.secretNetworkClient.tx.compute.executeContract(
      {
        contract_address: props.addr,
        code_hash: props.codeHash,
        sender: props.secretNetworkClient?.address,
        msg: {
          ibc_bloom: {
            pub_key: props.bloomerPubKey,
            offline_sig: props.bloomerOfflineSig,
            destination_addr: sourceChainNetworkClient.address, // addr on destination chain of connected keys
            amount_details: props.amountDetails
          }
        }
      },
      {
        broadcastCheckIntervalMs: 10000,
        gasLimit: withdraw_gas,
        gasPriceInFeeDenom: 0.2,
        feeDenom: 'uscrt',
        feeGranter: props.feeGrantStatus === 'success' ? faucetAddress : '',
        ibcTxsOptions: {
          resolveResponses: true,
          resolveResponsesCheckIntervalMs: 10_000,
          resolveResponsesTimeoutMs: 12 * 60 * 1000
        },
        broadcastMode: BroadcastMode.Sync
      }
    )
  } catch {}
  return
}

async function performIbcBloom(hprops: HProps): Promise<string> {
  const sourceChainNetworkClient = await IbcService.getChainSecretJs(hprops.chain)
  if (hprops.ibcMode === 'ibc-bloom') return broadcastIbcBloom(hprops, sourceChainNetworkClient)
}

export const HeadstashService = {
  performIbcBloom
}
