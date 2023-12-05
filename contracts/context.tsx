
// import type { UseHeadstashAirdropContractProps } from '@/contracts/headstash/useContract'
// import { HeadstashAirdropContract } from '@/contracts/headstash/contract'
// import { create } from 'zustand'
// import type { ReactNode } from 'react'
// import { useEffect } from 'react'
// import { State } from '@cosmos-kit/core'
// /**
//  * Contracts store type definitions
//  */
// export interface ContractsStore extends State {
//   headstashAirdrop: UseHeadstashAirdropContractProps | null
// }

// /**
//  * Contracts store default values as a separate variable for reusability
//  */
// export const defaultValues: ContractsStore = {
//   headstashAirdrop: null,

// }

// /**
//  * Entrypoint for contracts store using {@link defaultValues}
//  */
// export const useContracts = create<ContractsStore>(() => ({
//   ...defaultValues,
// }))

// /**
//  * Contracts store provider to easily mount {@link ContractsSubscription}
//  * to listen/subscribe to contract changes
//  */
// export const ContractsProvider = ({ children }: { children: ReactNode }) => {
//   return (
//     <>
//       {children}
//       <ContractsSubscription />
//     </>
//   )
// }

// /**
//  * Contracts store subscriptions (side effects)
//  *
//  * TODO: refactor all contract logics to zustand store
//  */
// const ContractsSubscription = () => {

//   const headstashAirdrop = HeadstashAirdropContract()


//   useEffect(() => {
//     useContracts.setState({
//       headstashAirdrop,
//     })
//   }, [
//     headstashAirdrop,
//   ])

//   return null
// }
