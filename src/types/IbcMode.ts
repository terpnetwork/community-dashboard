export type IbcMode = 'deposit' | 'withdrawal' | 'ibc-bloom'

export function isIbcMode(x: String): boolean {
  return x === 'deposit' || x === 'withdrawal' || x === 'ibc-bloom'
}
