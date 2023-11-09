import React, { useEffect, useState } from "react";
import { Button, Text } from "@interchain-ui/react"
import { useChain, useWallet } from "@cosmos-kit/react";
import MetamaskConnectButton from "../../components/wallet/metamask-connect-button";
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { Badge } from "@/components/ui/badge"
import { useIsClient } from "@/hooks";
import { toast } from 'react-hot-toast'
import { ethers } from "ethers";
import router, { useRouter } from "next/router";
import { useContracts } from "@/contracts/context";
import { SignedMessage } from "@/contracts/headstash";
import { headstashData } from '../../lib/headstash/headstashData';
import { proofData } from '../../lib/headstash/proofData';
import { PageHeaderDescription, PageHeaderHeading } from "@/components/utils/page-header";

const chainNames_1 = ["terpnetwork"];
const merkleRoot: string = '77fb25152b72ac67f5a155461e396b0788dd0567ec32a96f8201b899ad516b02';
type ClaimState = 'loading' | 'not_claimed' | 'claimed' | 'no_allocation'



export default function Headstash() {
  const router = useRouter()
  const { username, connect, disconnect, address, wallet, openView, status } = useChain(
    chainNames_1[0]
  );
  const { status: globalStatus, mainWallet } = useWallet(); // status here is the global wallet status for all activated chains (chain is activated when call useChain)
  const isClient = useIsClient();
  const headstashAirdropContract = useContracts().headstashAirdrop
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0)
  const [claimMsg, setClaimMsg] = useState('')
  const [cw20TokenAddress, setCW20TokenAddress] = useState('')
  const [eth_pubkey, setEthPubkey] = useState('')
  const [eth_sig, setEthSig] = useState('')
  const [executionResult, setExecutionResult] = useState('');
  const formattedTerpAmount = `${amount.slice(0, 5)}.${amount.slice(5)} $TERP`;
  const formattedThiolAmount = `${amount.slice(0, 5)}.${amount.slice(5)} $THIOL`;
  const [headstashState, setHeadstashState] = useState<ClaimState>('loading')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [proofs, setProofs] = useState<string[]>([''])
  const [signature, setSignature] = useState('')
  const [stage, setStage] = useState(0)
  const [signedMessage, setSignedMessage] = useState<SignedMessage | undefined>(undefined)
  const contractAddress = String(router.query.address);
  const transactionMessage = headstashAirdropContract?.messages()?.claim(contractAddress, stage, eth_pubkey, eth_sig, proofs.join(', '), signedMessage) || null;

  // Function to set the wallet address when it's available
  const handleEthPubkey = (eth_pubkey: string) => {
    setEthPubkey(eth_pubkey);
  };


  const [verificationDetails, setVerificationDetails] = useState(() => {
    try {
      // Load verification details from local storage if on the client side
      if (isClient) {
        const storedDetails = localStorage.getItem("verificationDetails");
        return storedDetails ? JSON.parse(storedDetails) : null;
      }
      return null;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return null;
    }
  });

  // State to track verification status
  const [isVerified, setIsVerified, setItem] = useState(false);

  // Fetch and set the Headstash amount when the wallet is connected
  useEffect(() => {
    console.log('Status:', status);
    console.log('Address:', address);
    console.log('Metamask:', eth_pubkey);
    // console.log('headstashData:', headstashData);

    const fetchHeadstashData = async (eth_pubkey: string) => {
      try {
        if (status === 'Connected' && eth_pubkey) {
          const matchedData = headstashData.find((data) => data.address === eth_pubkey);
          if (matchedData) {
            // Set the amount from the matched data
            setAmount(matchedData.amount);
          } else {
            // Handle the case when no matching data is found
            setAmount('')
          }
        }
      } catch (error) {
        setAmount('fetch if eligible error');
      }
    };

    void fetchHeadstashData(eth_pubkey);
  }, [status, eth_pubkey, wallet]);

  useEffect(() => {
    // Function to fetch and set proofs
    const fetchProofs = async (eth_pubkey: string) => {
      try {
        if (status === 'Connected' && eth_pubkey) {
          const matchedData = proofData.find((data) => data.address === eth_pubkey);
          if (matchedData) {
            setProofs(matchedData.proof);
            console.log(proofs)
          } else {
            setProofs('No proofs were found');
            console.log(proofs)
          }
        }
      } catch (error) {
        console.error('Error fetching Proof data', error);
        setProofs('Error fetching data');
      }
    };
    void fetchProofs(eth_pubkey);
  }, [status, eth_pubkey, wallet]);

  // Function to reset the proofs state
  const resetProofs = () => {
    setProofs('');
  };

  // if cosmos wallet not connected, connect.
  useEffect(() => {
    try {
      if (status === 'Disconnected') {
        connect(ConnectType.EXTENSION)
      }
    } catch (err: any) {
      toast.error(err.message, {
        style: { maxWidth: 'none' },
      })
    }
  }, [contractAddress, wallet])

  // set the signed claim message. 
  useEffect(() => {
    setSignedMessage({ claim_msg: claimMsg, signature })
  }, [signature, claimMsg])


  // Connect Metamask on page arrival
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

  // Handle personal_sign
  const handlePersonalSign = async () => {
    try {
      // Ensure MetaMask is connected
      if (!window.ethereum || !window.ethereum.selectedAddress) {
        console.error("MetaMask not connected or address not available");
        return;
      }

      const terpAddress: string = address.toString();
      const from = window.ethereum.selectedAddress;
      const exampleMessage = terpAddress;
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await window.ethereum.request({
        method: 'personal_sign',
        params: [msg, from],
      });

      const sig = {
        message: exampleMessage,
        signatureHash: sign,
        address: from,
        timestamp: new Date().toISOString(),
      };

      console.log("Personal Sign Signature:", sig);

      // Save verification details to local storage if available
      if (isClient && typeof localStorage !== "undefined") {
        localStorage.setItem("verificationDetails", JSON.stringify(sig));
      }

      // Update state with verification details
      setVerificationDetails(sig);
      setIsVerified(true);

      // Save verification details to local storage
    } catch (err) {
      console.error(err);
    }
  };

  // trunicate sig to display 
  function truncateString(str) {
    if (str && str.length >= 10) {
      const firstFive = str.slice(0, 5);
      const lastFive = str.slice(-5);
      return firstFive + "..." + lastFive;
    }
    return str; // Return the original string if it's too short to truncate
  }

  // cosmos wallet connect
  const getGlobalbutton = () => {
    if (globalStatus === "Connecting") {
      return (
        <Button onClick={() => connect()}>
          <PaperPlaneIcon className="mr-2 h-4 w-4" />
          {`Connecting ${wallet?.prettyName}`}
        </Button>
      );
    }
    if (globalStatus === "Connected") {
      return (
        <>   
          <h2 className="flex ">
            Cosmos PubKey: <br/> {address}
          </h2>
          <br/>

          <button
            style={{
              width: '260px',
              padding: '12px',
              backgroundColor: '#FF0000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}

            onClick={async () => {
              await disconnect();
              // setGlobalStatus(WalletStatus.Disconnected);
            }}
          >

            Disconnect
          </button>
        </>
      );
    }

   // claim headstash 
  const executeContract = async () => {
    try {
      if (!offlineSigner) {
        console.error("Offline signer not available");
        return;
      }

      const contractAddress = "TODO";

      // Log values before creating executeMsg
      const executeMsg = {
        claim: {
          amount: amount,
          proof: proofs,
          eth_pubkey: eth_pubkey,
          eth_sig: verificationDetails ? verificationDetails.signatureHash : '',
        },
      };

      console.log("Execute Message:", executeMsg);

      const msgExecute: MsgExecuteContract = {
        typeUrl: "/cosmwasm.wasm.v1beta1.MsgExecuteContract",
        value: {
          sender: offlineSigner.senderAddress,
          contract: contractAddress,
          msg: toUtf8(JSON.stringify(executeMsg)),
          funds: [],
        },
      };

      const fee = {
        amount: [{ denom: "uthiolx", amount: "8000" }],
        gas: "500000",
      };

      const result = await offlineSigner.sendTokens(offlineSigner.senderAddress, offlineSigner.address, [fee], [msgExecute]);
      assertIsBroadcastTxSuccess(result);

      setExecutionResult(`Transaction sent successfully: ${result.transactionHash}`);
      console.log("Execution Result:", result);
    } catch (error) {
      setExecutionResult(`Error: ${error.message}`);
      console.error("Execution Error:", error);
    }
  };

    return (
      <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:">
        <button
          onClick={() => connect()}
          style={{
            width: '260px',
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >Connect</button>
      </div>
    );
  };;

  function toRegistration() {
    router.push('/register');

  }

  // Components

  return (
    <main
      className="claim-head"
    >
      <div className="steps-container">

        <div className="steps-card">
          <div className="inner-card">
            <div className="step-one-card">
              <h1>  <PageHeaderHeading>1. Connect Metamask</PageHeaderHeading></h1>
              <br />
              <MetamaskConnectButton handleEthPubkey={handleEthPubkey} />
              <br />
              <PageHeaderDescription>Your Headstash Amount: <br/> </PageHeaderDescription>
              <h2 className="center">
              {amount !== '' ? formattedTerpAmount : 'checking eligibility...'}
               <br/>
            {amount !== '' ? formattedThiolAmount : ''}
            </h2>
            </div>
          </div>
        </div>

        <div className="steps-card">
          <div className="inner-card">
            <div className="step-one-card">
              <PageHeaderHeading>2. Connect Cosmos Wallet</PageHeaderHeading>
              <PageHeaderDescription></PageHeaderDescription>
              <br />
              {getGlobalbutton()}

            </div>
          </div>
        </div>
        <div className="steps-card">
          <div className="inner-card">
            <div className="step-one-card">
              <PageHeaderHeading>3. Verify Metamask Ownership</PageHeaderHeading>
              <PageHeaderDescription></PageHeaderDescription>
              <p>A signed message will verify you own your wallet.</p>
              <br />
              <button
                style={{
                  width: '260px',
                  padding: '12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={handlePersonalSign}
                disabled={isVerified}
              >
                Sign & Verify
              </button>
              <div></div>
              <br/>
              {verificationDetails ? (
                <h2 >
                  <p>Signature Hash: <br/> {truncateString(verificationDetails.signatureHash)}</p>
                </h2>
              ) : null}
              <div></div>
              {verificationDetails ? (
                <h2>
                  <p>Metamask PubKey:<br/> {verificationDetails.address}</p>
                </h2>
              ) : null}
              <br/>
              <p>Merkle Proofs:</p>
              <div class="proof-window">
              {proofs ? (
                <h2 >
                  <p> <br/> {proofs}</p>
                </h2>
              ) : null}
              </div>
          

            </div>
          </div>
        </div>

        <div className="steps-card">
          <div className="inner-card">
            <div className="step-one-card">

              <PageHeaderHeading>4.  Claim Your Headstash</PageHeaderHeading>
              <PageHeaderDescription> </PageHeaderDescription>
              <p></p>
              <button
                style={{
                  width: '260px',
                  padding: '12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              // onClick={claim}
              >
                {headstashState === 'claimed' ? 'Headstash Claimed' : 'Claim Headstash'}
              </button>
              <br />


            </div>
          </div>
        </div>
      </div>
    </main>
  )
}