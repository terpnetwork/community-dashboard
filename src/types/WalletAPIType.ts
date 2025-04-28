export type WalletAPIType = 'keplr' | 'leap' | 'throwaway'

export function isWalletAPIType(x: String): boolean {
  return x === 'keplr' || x === 'leap' || x === 'throwaway'
}
