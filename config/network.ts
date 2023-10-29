import type { AppConfig } from '@/config/app'

export const mainnetConfig: AppConfig = {
  chainId: 'morocco-1',
  chainName: 'Terp Network',
  addressPrefix: 'terp',
  rpcUrl: 'https://rpc-terp.zenchainlabs.io',
  httpUrl: 'https://api-terp.zenchainlabs.io:443',
  feeToken: 'uthiol',
  bondToken: 'uterp',
  coinMap: {
    uterp : { denom: 'TERP', fractionalDigits: 6 },
    uthiol : { denom: 'THIOL', fractionalDigits: 6 },
  },
  gasPrice: 0.05,
  fees: {
    upload: 1500000,
    init: 500000,
    exec: 200000,
  },
}

export const testnetConfig: AppConfig = {
  chainId: '90u-2',
  chainName: 'Terp Testnet',
  addressPrefix: 'terp',
  rpcUrl: '"https://terp-testnet-rpc.itrocket.net:443',
  httpUrl: 'https://terp-testnet-api.itrocket.net:443',
  feeToken: 'uthiolx',
  bondToken: 'uterpx',
  coinMap: {
    uterpx: { denom: 'TERPX', fractionalDigits: 6 },
    uthiolx: { denom: 'THIOLX', fractionalDigits: 6 },

  },
  gasPrice: 0.05,
  fees: {
    upload: 1500000,
    init: 500000,
    exec: 200000,
  },
}

export const getConfig = (network: string): AppConfig => {
  if (network === 'mainnet') return mainnetConfig
  return testnetConfig
}
