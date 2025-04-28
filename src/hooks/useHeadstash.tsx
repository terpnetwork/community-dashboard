import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface HeadstashData {
  headstashAmount: number | null
  headstashProofs: string[] | null
  loading: boolean
}

export function useHeadstash(eth_pubkey: string): HeadstashData {
  type FetchAmountState = 'loading' | 'no_proofs' | 'amounts_fetch' | 'not_fetched_yet'
  type FetchProofState = 'loading' | 'no_proofs' | 'proofs_fetched' | 'not_fetched_yet'
  const [amountState, setAmountState] = useState<FetchAmountState>('not_fetched_yet')
  const [proofState, setProofsState] = useState<FetchProofState>('not_fetched_yet')
  const [headstashAmount, setHeadstashAmount] = useState<number | null>(null)
  const [headstashProofs, setHeadstashProofs] = useState<string[] | null>(null)

  const [loading, setLoading] = useState(true)

  const fetchHeadstash = async () => {
    try {
      // Check if eth_pubkey exists
      if (!eth_pubkey) {
        toast.error('eth_pubkey is required')
        console.error('eth_pubkey is required')
        return
      }

      // Log the HEADSTASH_API_URL to verify it
      console.log(import.meta.env.HEADSTASH_API_URL)

      // Set loading state to true
      setLoading(true)

      const headstashAmountAPI = `http://localhost:3001/getAmount/${eth_pubkey}`
      const headstashProofAPI = `http://localhost:3001/getProofs/${eth_pubkey}`

      // GET request for amounts
      const amounts = await fetch(headstashAmountAPI)

      if (amounts.ok) {
        const result = await amounts.json()
        const { amount } = result
        toast.success(`${result}`)
        setHeadstashAmount(amount)
        setAmountState('amounts_fetch')
      } else {
        console.error('Faucet request failed with status:', amounts.status)
      }
      // console.log("Connected Accounts Allocation:", result);

      // GET request for proofs
      const proofsResponse = await fetch(headstashProofAPI)
      if (proofsResponse.ok) {
        const result = await proofsResponse.json()
        console.log('Headstash Proofs:', result)
        setHeadstashProofs(result)
        setProofsState('proofs_fetched')
      } else {
        console.error('Proofs request failed with status:', proofsResponse.status)
      }

      // Reset loading state
      setLoading(false)
    } catch (err) {
      toast.error(`${err}`)
      console.error(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHeadstash()

    // Cleanup function (optional)
    return () => {}
  }, [eth_pubkey])

  return {
    headstashAmount,
    headstashProofs,
    loading
  }
}
