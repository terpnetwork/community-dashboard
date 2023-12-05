import * as React from 'react'
import { useSignMessage } from 'wagmi'
import { recoverMessageAddress } from 'viem'

export function SignMessage() {
  // const recoveredAddress = React.useRef<string>()
  const { data: signMessageData, error, isLoading, signMessage, variables } = useSignMessage()

  React.useEffect(() => {
    (async () => {
      if (variables?.message && signMessageData) {
        const recoveredAddress = await recoverMessageAddress({
          message: variables?.message,
          signature: signMessageData,
        })
        recoveredAddress
      }
    })()
  }, [signMessageData, variables?.message])

  return (
    <form
    onSubmit={(event) => {
      event.preventDefault();
      const message = eth_pubkey as string || ''; 
      signMessage({ message });
    }}
  >
      <label htmlFor="message">Enter a message to sign</label>
      <textarea
        id="message"
        name="message"
        placeholder="The quick brown fox…"
      />
      <button disabled={isLoading}>
        {isLoading ? 'Check Wallet' : 'Sign Message'}
      </button>

      {/* {data && (
        <div>
          <div>Recovered Address: {recoveredAddress.current}</div>
          <div>Signature: {data}</div>
        </div>
      )} */}

      {error && <div>{error.message}</div>}
    </form>
  )
}
