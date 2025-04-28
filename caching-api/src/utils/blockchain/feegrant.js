import { Wallet, SecretNetworkClient, EncryptionUtilsImpl } from 'secretjs'

// wallet
export const chain_id = 'pulsar-3'
export const wallet = new Wallet(
  'goat action fuel major strategy adult kind sand draw amazing pigeon inspire antenna forget six kiss loan script west jaguar again click review have'
)
export const txEncryptionSeed = EncryptionUtilsImpl.GenerateNewSeed()

// signing client
export const secretjs = new SecretNetworkClient({
  chainId: chain_id,
  url: 'https://api.pulsar.scrttestnet.com',
  wallet: wallet,
  walletAddress: wallet.address,
  txEncryptionSeed: txEncryptionSeed
})

let broadcastFeeGrant = async (cosmos_addr) => {
  let msg = await secretjs.tx.feegrant.grantAllowance({
    granter: wallet.address,
    grantee: cosmos_addr,
    allowance: {
      allowance: { spend_limit: [{ denom: 'uscrt', amount: '1000000' }] },
      allowed_messages: ['/secret.compute.v1beta1.MsgExecuteContract']
    }
  })

  if (msg.code != 0) {
    return msg.arrayLog
  }
  return msg.rawLog
}

export { broadcastFeeGrant }
