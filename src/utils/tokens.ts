import { Token, tokens } from './config'

export const scrtToken: Token = tokens.find((token) => token.name === 'SCRT')

export const convertMicroDenomToDenomWithDecimals = (amount: number | string, decimals: number) => {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  amount = amount / Math.pow(10, decimals)
  return isNaN(amount) ? 0 : amount
}
