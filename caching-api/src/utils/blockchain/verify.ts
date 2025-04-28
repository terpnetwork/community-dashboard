import { ethers } from 'ethers'

// Define your function that operates with address and signature
export function verifyEncryptedEthSig(address: string, cosmos_addr: string, signature: string) {
  // Verification
  const recoveredAddress = ethers.verifyMessage(cosmos_addr, signature)
  if (recoveredAddress.toLowerCase() != address.toLowerCase()) {
    return 'Address not found'
  }

  return recoveredAddress
}
