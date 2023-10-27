import React, { useEffect, useState } from "react";
import { Button, Text } from "@interchain-ui/react"
import { useChain, useWallet } from "@cosmos-kit/react";
import MetamaskConnectButton from "../../components/wallet/metamask-connect-button";
import { ArrowRightIcon, PaperPlaneIcon, ResetIcon } from "@radix-ui/react-icons"
import { Badge } from "@/components/ui/badge"
import { useIsClient } from "@/hooks";
import { ethers } from "ethers";
import router, { useRouter } from "next/router";
import { useContracts } from "@/contracts/context";
import { SignedMessage } from "@/contracts/headstash";

const chainNames_1 = ["terpnetwork"];
const chainNames_2: string[] = [];
type ClaimState = 'loading' | 'not_claimed' | 'claimed' | 'no_allocation'

export default function Headstash() {
    const router = useRouter()
    const { username, connect, disconnect, address,wallet, openView, status } = useChain(
        chainNames_1[0]
      );
      const { status: globalStatus, mainWallet } = useWallet(); // status here is the global wallet status for all activated chains (chain is activated when call useChain)
      const isClient = useIsClient();
      const headstashAirdropContract = useContracts().headstashAirdrop
      const [signature, setSignature] = useState('')
      const [claimMsg, setClaimMsg] = useState('')
      const [amount, setAmount] = useState('')
      const [eth_pubkey, setEthPubkey] = useState('')
      const [eth_sig, setEthSig] = useState('')
      const [loading, setLoading] = useState(false)
      const [proofs, setProofs] = useState<string[]>([''])
      const [name, setName] = useState('')
      const [cw20TokenAddress, setCW20TokenAddress] = useState('')
      const [balance, setBalance] = useState(0)
      const [stage, setStage] = useState(0)
      const [signedMessage, setSignedMessage] = useState<SignedMessage | undefined>(undefined)
      const [headstashState, setHeadstashState] = useState<ClaimState>('loading')
      const contractAddress = String(router.query.address)
      const transactionMessage =
      headstashAirdropContract?.messages()?.claim(contractAddress, stage, amount, eth_pubkey, eth_sig, proofs, signedMessage) || null

      const getHeadstash = async (address: string) => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/airdrops/status/${address}`)
        return data.airdrop
      }

// if cosmos wallet not connected, connect.
      // useEffect(() => { 
      //   try {
      //     if (status === 'Disconnected') {
      //       connect(ConnectType.EXTENSION)
      //     }
      //   } catch (err: any) {
      //     toast.error(err.message, {
      //       style: { maxWidth: 'none' },
      //     })
      //   }
      // }, [contractAddress, wallets])

// set the signed claim message. 
      // useEffect(() => {
      //   setSignedMessage({ claim_msg: claimMsg, signature })
      // }, [signature, claimMsg])

// get headstash info.  [including proofs]     
      // useEffect(() => {
      //   const getHeadstashInfo = async () => {
      //     try {
      //       if ( status === 'Disconnected' || contractAddress === '') return
    
      //       const headstashAirdropContractMessages = headstashAirdropContract?.use(contractAddress)
    
      //       const headstash = await getHeadstash(contractAddress)
    
      //       const address =  wallet.address
    
      //       const { data } = await axios.get(
      //         `${process.env.NEXT_PUBLIC_API_URL}/proofs/contract/${contractAddress}/wallet/${address}`,
      //       )
      //       const { account } = data
      //       if (account) {
      //         // eslint-disable-next-line @typescript-eslint/no-shadow
      //         const stage = await headstashAirdropContractMessages?.getLatestStage()
      //         const isClaimed = await headstashAirdropContractMessages?.isClaimed(address, stage || 0)
    
      //         setProofs(account.proofs)
      //         setAmount((account.amount as number).toString())
      //         setName(headstash.name)
      //         setCW20TokenAddress(airdrop.cw20TokenAddress) // prob won't need
    
      //         if (isClaimed) setHeadstashState('claimed')
      //         else setHeadstashState('not_claimed')
      //       } else {
      //         setHeadstashState('no_allocation')
      //       }
      //     } catch (err: any) {
      //       setLoading(false)
      //       toast.error(err.message, {
      //         style: { maxWidth: 'none' },
      //       })
      //     }
      //   }
    
      //   void getHeadstashInfo()
      // }, [contractAddress, wallet.address, wallet.initialized, wallets[0]?.terraAddress])
   

// get the latest stage of the headstash airdrop .
      // useEffect(() => {
      //   if (!headstashAirdropContract || contractAddress === '') return

      //   void headstashAirdropContract.use(contractAddress)?.getLatestStage().then(setStage)
      // }, [headstashAirdropContract, contractAddress])

// claim headstash message.
      // const claim = async () => {
      //   try {
      //     if (isWalletDisconnected === 'true') return toast.error('Please connect your wallet!')
      //     if (!headstashAirdropContract) return toast.error('Could not connect to smart contract')

      //     setLoading(true)

      //     const contractMessages = headstashAirdropContract.use(contractAddress)

      //     let signedMsg = setSignedMessage(signedMessage)

      //     await contractMessages?.claim(stage, amount, eth_pubkey, eth_sig, proofs, signedMsg)

      //     setLoading(false)
      //     setHeadstashState('claimed')
      //     toast.success('Successfully claimed the airdrop!', {
      //       style: { maxWidth: 'none' },
      //     })
      //     setBalance(balance + parseInt(amount))
      //   } catch (err: any) {
      //     setLoading(false)
      //     toast.error(err.message, {
      //       style: { maxWidth: 'none' },
      //     })
      //   }
      // }

// suggest token to keplr message. *prob not needed*
      // const addToken = async () => {
      //   try {
      //     if (!window.getOfflineSigner) {
      //       throw new Error('Keplr extension is not available')
      //     }

      //     const config = getConfig(NETWORK)

      //     await window.keplr?.suggestToken(config.chainId, cw20TokenAddress)
      //   } catch (err: any) {
      //     setLoading(false)
      //     toast.error(err.message, {
      //       style: { maxWidth: 'none' },
      //     })
      //   }
      // }


      useEffect(() => {
        const fn = async () => {
          await mainWallet?.connect();
        };
        fn();
      }, []);
    
      if (!isClient) return null;

    // eth message signing logic
    const messageToSign = async ({ message, setError }) => {
        try {
          if (!window.ethereum)
            setError("Please connect your wallet before signing a message!");
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const signatureHash = await signer.signMessage(message);
          const date = new Date();
          const minutes = date.getMinutes();
          const minutedigit = minutes <= 9 ? '0' + minutes : minutes;
          const seconds = date.getSeconds();
          const seconddigit = seconds <= 9 ? '0' + seconds : seconds;
          const dateFormat =
            date.toDateString().slice(4) +
            " " +
            date.getHours() +
            ":" +
            minutedigit +
            ":" +
            seconddigit;
          const timestamp = dateFormat.toString();
          const address = await signer.getAddress();
    
          return {
            message,
            signatureHash,
            address,
            timestamp,
          };
        } catch (err) {
          console.log(err.message);
        }
      };
      // eth message signing logic    
    const signMessageHandler = async (e) => {
    e.preventDefault();
    const entry = new FormData(e.target);
    const sig = await messageToSign({
        message: "message", // TODO: set the message always as the connected cosmos wallet.
    });
    if (sig) {
        props.onSubmit(sig);
    }
    };
      // cosmos wallet connect
      const getGlobalbutton = () => {
        if (globalStatus === "Connecting") {
          return (
            <Button  onClick={() => connect()}>
              <PaperPlaneIcon className="mr-2 h-4 w-4" />
              {`Connecting ${wallet?.prettyName}`}
            </Button>
          );
        }
        if (globalStatus === "Connected") {
          return (
            <>
              <Button size="sm" onClick={() => openView()}>
                <div className="flex justify-center items-center space-x-2">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-green-500 leading-4 mb-2" />
                  <span>Connected to: {wallet?.prettyName}</span>
                </div>
              </Button>
    
              <Badge className="flex">
                Account name: {username}
              </Badge>
              <Badge className="flex">
                Account name: {address}
              </Badge>
    
              <Button

                onClick={async () => {
                  await disconnect();
                  // setGlobalStatus(WalletStatus.Disconnected);
                }}
              >
                <ResetIcon className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </>
          );
        }
    
        return (
        <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:">
         
          <Button
         onClick={() => connect()}
       
         >Connect Wallet</Button>
         </div>
         );
      };;

    function toRegistration() {
        router.push('/register');

    }

    // Components

    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between p-24 `}
        >
            <div className="steps-container">

                <div className="steps-card">
                    <div className="inner-card">
                        <div className="step-one-card">
                            <h1>  <Text
                                fontSize={{
                                    base: "4xl",
                                    sm: "5xl",
                                    md: "6xl",
                                }}
                                display={{
                                    base: "block",
                                    lg: "inline",
                                }}
                                w="full"
                                bgClip="text"
                                bgGradient="linear(to-r, green.400,purple.500)"
                                fontWeight="extrabold"
                            >1</Text></h1>
                            <h1>Connect Metamask </h1>
                            <p>Verify your headstash allocation.</p>
                            <br />
                            <MetamaskConnectButton setError={function (error: string | null): void {
                                throw new Error("Function not implemented.");
                            }} />
                        </div>
                    </div>
                </div>
                <div className="steps-card">
                    <div className="inner-card">
                        <div className="step-one-card">
                            <h1>
                                <Text
                                    fontSize={{
                                        base: "4xl",
                                        sm: "5xl",
                                        md: "6xl",
                                    }}
                                    display={{
                                        base: "block",
                                        lg: "inline",
                                    }}
                                    w="full"
                                    bgClip="text"
                                    bgGradient="linear(to-r, green.400,purple.500)"
                                    fontWeight="extrabold"
                                >2</Text></h1>
                            <h1>Connect Cosmos Wallet To Dashboard</h1>
                            <p>View list of compatible wallets.</p>
                            <br />
                            {getGlobalbutton()}

                        </div>
                    </div>
                </div>
                <div className="steps-card">
                    <div className="inner-card">
                        <div className="step-one-card">
                            <h1>
                                <Text
                                    fontSize={{
                                        base: "4xl",
                                        sm: "5xl",
                                        md: "6xl",
                                    }}
                                    display={{
                                        base: "block",
                                        lg: "inline",
                                    }}
                                    w="full"
                                    bgClip="text"
                                    bgGradient="linear(to-r, green.400,purple.500)"
                                    fontWeight="extrabold"
                                >3</Text></h1>
                            <h1>Verify Metamask Ownership</h1>
                            <p>A signed message will verify you own your wallet.</p>
                            <br />
                            <Button
                                width="260px"
                                btnContent="Follow Terp on X"
                                handleClick={toRegistration}

                            />

                        </div>
                    </div>
                </div>
                <div className="steps-card">
                    <div className="inner-card">
                        <div className="step-one-card">
                            <h1>
                                <Text
                                    fontSize={{
                                        base: "4xl",
                                        sm: "5xl",
                                        md: "6xl",
                                    }}
                                    display={{
                                        base: "block",
                                        lg: "inline",
                                    }}
                                    w="full"
                                    bgClip="text"
                                    bgGradient="linear(to-r, green.400,purple.500)"
                                    fontWeight="extrabold"
                                >4</Text></h1>
                            <h1> Generate Proof's</h1>
                            <p></p>
                            <br />


                        </div>
                    </div>
                </div>
                <div className="steps-card">
                    <div className="inner-card">
                        <div className="step-one-card">
                            <h1>
                                <Text
                                    fontSize={{
                                        base: "4xl",
                                        sm: "5xl",
                                        md: "6xl",
                                    }}
                                    display={{
                                        base: "block",
                                        lg: "inline",
                                    }}
                                    w="full"
                                    bgClip="text"
                                    bgGradient="linear(to-r, green.400,purple.500)"
                                    fontWeight="extrabold"
                                >5</Text></h1>
                            <h1> Claim Airdrop </h1>
                            <p></p>
{/* Claim Headstash Button
                           <Button
                            onClick={claim}>
                    {headstashState === 'claimed' ? 'Headstash Claimed' : 'Claim Headstash'}
                            </Button> */}
                            <br />


                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}