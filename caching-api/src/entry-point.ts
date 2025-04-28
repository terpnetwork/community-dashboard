'use strict'
import express from 'express'
import 'dotenv/config'
import https from 'https'
import fs from 'fs'
import decode from 'bs58'
import toobusy from 'toobusy-js'
import { verifyEncryptedEthSig } from './utils/blockchain/verify.js'
import { Wallet, SecretNetworkClient, validateAddress, BroadcastMode, MsgExec, MsgGrantAllowance } from 'secretjs'

import nacl from 'tweetnacl'
import init, * as ecies from 'ecies-wasm'

import * as solana from '@solana/web3.js'
// endpoint stuff
const PORT = process.env.PORT || '3000'
const PRIVKEY = process.env.ECIES_PRIV || 'na'
const SECRET_CHAIN_ID = process.env.CHAIN_ID || 'pulsar-3'
const SECRET_LCD = process.env.LCD_NODE || 'https://api.pulsar.scrttestnet.com'

// wallet stuff
const mnemonic = process.env.FAUCET_MNEMOMIC || undefined
const wallet = new Wallet(
  'goat action fuel major strategy adult kind sand draw amazing pigeon inspire antenna forget six kiss loan script west jaguar again click review have'
)
const faucetAddress = wallet.address

// feegrant tx stuff
const faucetAmount = process.env.FAUCET_AMOUNT || '10000'
const faucetDenom = process.env.FAUCET_DENOM || 'uscrt'
const faucetReload = process.env.FAUCET_RELOAD_TIME || '24'
const faucetReloadHours = Number(faucetReload)
const faucetReloadSeconds = Math.ceil(faucetReloadHours * 3600)
const gasDenom = process.env.GAS_DENOM || 'uscrt'
const gasFee = process.env.GAS_FEE || '0.5'
const gasLimit = process.env.GAS_LIMIT || '17500'
const memo = process.env.MEMO || ''

// new secret network client
const secretjs = new SecretNetworkClient({
  url: SECRET_LCD,
  chainId: SECRET_CHAIN_ID,
  wallet: wallet,
  walletAddress: faucetAddress
})

// We start the server, and ecies-wasm
const app = express()
init()

// Begin the API service
app.listen(parseInt(PORT), () => {
  if (mnemonic === undefined) {
    throw Error('no mnemonic defined, aborting')
  }
  console.log("Serveur à l'écoute ", PORT)
})

// Allow any to access this API.
app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// handle overload of API
app.use(function (_req, res, next) {
  if (toobusy()) {
    res.status(503).send("I'm busy right now, sorry.")
  } else {
    next()
  }
})

async function main() {
  // load json use to generate merkle tree root
  const rawAmountData = fs.readFileSync(`./${process.env.AMOUNT_JSON_PATH}`, 'utf8')
  const amountData = JSON.parse(rawAmountData.toString())

  // ENTRY: retrives data for a wallet.
  app.get('/getHeadstash/:address', (req, res) => {
    let { address } = req.params
    address = address.toLowerCase().trim()

    // Find the entry with the matching address
    const entry = amountData.find((item: { address: string }) => item.address.toLowerCase().trim() === address)

    if (!entry) {
      return res.status(404).json({ error: 'Address not found' })
    }
    res.json({ headstash: entry.headstash })
  })

  // ENTRY: request a feegrant.
  app.get('/feeGrant/:address/:cosmos/:signature', async (req, res) => {
    let { address, cosmos, signature } = req.params

    address = address.toLowerCase().trim()
    // Find the entry with the matching address
    const entry = amountData.find((item: { address: string }) => item.address.toLowerCase().trim() === address)

    if (!entry) {
      return res.status(404).json({ error: 'pubkey not included in airdrop' })
    }

    // verify the cosmos address
    if (!cosmos) {
      return res.status(400).json({ error: 'Address is required' })
    }
    if (!validateAddress(cosmos).isValid) {
      return res.status(400).json({ error: 'Address is invalid' })
    }

    // decrypt encoded signature
    const e = new TextEncoder()
    const decrypted = ecies.decrypt(e.encode(PRIVKEY), e.encode(signature))
    const d = new TextDecoder()
    let sig = d.decode(decrypted)

    if (address.startsWith('0x1')) {
      // verify signature for eth pubkey
      let isCorrectSig = verifyEncryptedEthSig(address, cosmos, sig)
      if (isCorrectSig.toLowerCase() !== address.toLowerCase()) {
        return res.status(404).json({ error: 'Unexpected Error' })
      }
    } else if (!address.startsWith('secret')) {
      try {
        const verifySignature = (decrypted_sig: string, publicKey: string, signedContent: string) => {
          // Convert base64 encoded signature to bytes
          const signatureBytes = Buffer.from(decrypted_sig, 'base64')
          const messageBytes = Buffer.from(signedContent, 'base64')
          const pubKey = new solana.PublicKey(publicKey)

          const result = nacl.sign.detached.verify(
            messageBytes, // bytes of msg signed
            signatureBytes, // signature bytes
            Buffer.from(pubKey.toBase58()) // pubkey bytes Base58
          )
          if (!result) {
            throw new Error('Invalid Solana signature')
          }
        }
        verifySignature(sig, address, signature)
      } catch (error) {
        return res.status(401).json({ error: 'Invalid Solana signature' })
      }
    } else {
      // verify signature for cosmos pubkey
      try {
        return res.status(420).json({ error: 'Unsupported feature currently' })
      } catch {
        return res.status(401).json({ error: 'Invalid Cosmos signature' })
      }
    }

    // verify cosmos wallet does not already have balance
    try {
      // const { balance } = await secretjs.query.bank.balance({
      //   address,
      //   denom: "uscrt",
      // });

      // if (Number(balance?.amount) != 0) {
      //   console.log("Account has funds")
      // }
      // check if feegrant already exists or is expired
      // secretjs.query.feegrant
      //   .allowance({ grantee: address, granter: faucetAddress })
      //   .then(async (result: any) => {
      // console.log("result:", result);
      // if (result?.allowance) {
      // if (isFeeGrantExpired(result.allowance.allowance.expiration, faucetReloadSeconds)) {
      //   console.log("Fee Grant expired");
      //   const feeGrant = await broadcastFeeGrant(secretjs, address);
      //   const results = { feeGrant };
      //   return res.json(results);
      // }
      // else {
      //   console.log("Existing Fee Grant");
      //   const results = { feegrant: result.allowance, address: address };
      //   return res.json(results);
      // }
      // } else {
      console.log('new feegrant')
      const feeGrant = await broadcastFeeGrant(secretjs, cosmos)
      const results = { feeGrant }
      return res.json(results)
      // }
      // }).catch(async (e) => {
      //   console.error(e);
      //   return res.status(400).json({ error: e });
      // })
    } catch (error) {
      console.error('Error querying data:', error)
      return res.status(500).send('Internal Server Error')
    }
  })

  // if (process.env.EXECUTION == 'PRODUCTION') {
  //   const options = {
  //     cert: fs.readFileSync('/home/illiquidly/identity/fullchain.pem'),
  //     key: fs.readFileSync('/home/illiquidly/identity/privkey.pem')
  //   }
  //   https.createServer(options, app).listen(parseInt(PORT))
  // }
}
main()

// broadcast the feegrant msg, on behalf of another account via x/authz
let broadcastFeeGrant = async (secretjs: SecretNetworkClient, cosmos_addr: string) => {
  const msgExec = new MsgExec({
    grantee: cosmos_addr,
    msgs: [
      new MsgGrantAllowance({
        granter: wallet.address,
        grantee: cosmos_addr,
        allowance: {
          allowance: { spend_limit: [{ denom: faucetDenom, amount: faucetAmount }] },
          allowed_messages: ['/secret.compute.v1beta1.MsgExecuteContract']
        }
      })
    ]
  })

  const tx = await secretjs.tx.broadcast([msgExec], {
    memo: memo,
    broadcastCheckIntervalMs: 100,
    feeDenom: gasDenom,
    gasPriceInFeeDenom: Number(gasFee),
    gasLimit: Number(gasLimit),
    broadcastMode: BroadcastMode.Block
  })

  if (tx) {
    if (tx.code != 0) {
      return tx
    }
    return tx
  }
  return tx
}
