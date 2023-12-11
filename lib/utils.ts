import { type ClassValue, clsx } from "clsx"
import { env } from "process"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL
// export const HEADSTASH_CODE_ID = parseInt(process.env.NEXT_PUBLIC_HEADSTASH_CODE_ID, 10)
// export const HEADSTASH_ACCOUNT_LIMIT = parseInt(process.env.NEXT_PUBLIC_HEADSTASH_ACCOUNT_LIMIT, 10)

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK

export const getAirdropDate = (date: number, type: string | null) => {
  if (type === null) return '-'
  if (type === 'height') return date
  const d = new Date(date * 1000)
  return `${d.toLocaleDateString('en-US')} approx`
}

// export const getExecuteFee = () => {
//   const config = getConfig(NETWORK)
//   return {
//     amount: coins(500000, config.feeToken),
//     gas: '1000000',
//   }
// }


export interface HeadstashAirdropProps {
  name: string
  contractAddress: string
  merkleRoot: string
  totalAmount: number
  activeStep: string
  start: number | null
  startType: string | null
  expiration: number | null
  expirationType: string | null
  processing?: boolean
  status?: string
  accountsSize?: number
  isNative?: boolean
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}