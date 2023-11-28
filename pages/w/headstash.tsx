import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from 'react-hot-toast'
import { useChain, useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { Button } from "@interchain-ui/react"
import MetamaskConnectButton from "../../components/wallet/metamask-connect-button";
import { PageHeaderDescription, PageHeaderHeading } from "@/components/utils/page-header";
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { useIsClient } from "@/hooks";
import { useContracts } from "@/contracts/context";
import { SignedMessage } from "@/contracts/headstash";
import { headstashData } from '../../lib/headstash/headstashData';
import { proofData } from '../../lib/headstash/proofData';
import { toUtf8 } from "@cosmjs/encoding";
import { assertIsDeliverTxSuccess, SigningStargateClient } from "@cosmjs/stargate"
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet, OfflineDirectSigner } from "@cosmjs/proto-signing"
import { getShortSig } from "@/utils/getShortSig";
import {BlurredContent} from '@/components/headstash/blurContent'

const chainNames_1 = ["terpnettestnet"];
const merkleRoot: string = '77fb25152b72ac67f5a155461e396b0788dd0567ec32a96f8201b899ad516b02';
const mnemonic = "sing cart stuff gorilla blur elegant slab field glide cheap diet believe turtle face clog rude license begin awkward spider stool patrol coral element"
const rpc = "https://terp-testnet-rpc.itrocket.net:443";
type ClaimState = 'loading' | 'not_claimed' | 'claimed' | 'no_allocation'

const getAliceSignerFromMnemonic = async (): Promise<OfflineDirectSigner> => {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "terp",
  })
}

export default function Headstash() {
  const router = useRouter()
  const { username, connect, disconnect, getOfflineSignerDirect, address, wallet, openView, status } = useChain(
    chainNames_1[0]
  );
  const { status: globalStatus, mainWallet } = useWallet(); // status here is the global wallet status for all activated chains (chain is activated when call useChain)
  const isClient = useIsClient();
  const headstashAirdropContract = useContracts().headstashAirdrop
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [claimMsg, setClaimMsg] = useState('')
  const [cw20TokenAddress, setCW20TokenAddress] = useState('')
  const [eth_pubkey, setEthPubkey] = useState('')
  const [eth_sig, setEthSig] = useState('')
  const [executionResult, setExecutionResult] = useState('');
  const formattedTerpAmount = `${amount.slice(0, 5)}.${amount.slice(5)} $TERP`;
  const formattedThiolAmount = `${amount.slice(0, 5)}.${amount.slice(5)} $THIOL`;
  const [headstashState, setHeadstashState] = useState<ClaimState>('loading');
  const [feegrantState, setFeegrantState] = useState<ClaimState>('not_claimed');
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [proofs, setProofs] = useState<string[]>([''])
  const [signature, setSignature] = useState('')
  const [stage, setStage] = useState(0)
  const [signedMessage, setSignedMessage] = useState<SignedMessage | undefined>(undefined)
  const contractAddress = String(router.query.address);
  const transactionMessage = headstashAirdropContract?.messages()?.claim(contractAddress, eth_pubkey, eth_sig, proofs, signedMessage) || null;
  const [isVerified, setIsVerified, setItem] = useState(false);


  // WALLET CONFIG //

  // set eth_pubkey
  const handleEthPubkey = (eth_pubkey: string) => {
    setEthPubkey(eth_pubkey);
  };

  // connect Keplr
  useEffect(() => {
    const initializeKeplr = async () => {
      try {
        if (isClient && window.getOfflineSigner) {
          await window.getOfflineSigner(chainNames_1[0]);
          if (window.getOfflineSigner && window.getOfflineSigner(chainNames_1[0])) {
            await connect();
          }
        }
      } catch (error) {
        console.error("Error initializing Keplr:", error);
      }
    };
    initializeKeplr();
  }, []);

  const [ethSigDetails, setEthSigDetails] = useState(() => {
    try {
      if (isClient) {
        const storedDetails = localStorage.getItem("ethSigDetails");
        return storedDetails ? JSON.parse(storedDetails) : null;
      }
      return null;
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return null;
    }
  });


  // fetch headstash data
  useEffect(() => {
    console.log('Status:', status);
    console.log('Address:', address);
    console.log('Metamask:', eth_pubkey);
    console.log('EthSig:', eth_sig);
    const fetchHeadstashData = async (eth_pubkey: string) => {
      try {
        if (status === 'Connected' && eth_pubkey) {
          const matchedData = headstashData.find((data) => data.address === eth_pubkey);
          if (matchedData) {
            setAmount(matchedData.amount);
          } else {
            setAmount('Not Eligible')
          }
        }
      } catch (error) {
        setAmount('fetch if eligible error');
      }
    };

    void fetchHeadstashData(eth_pubkey);
  }, [status, eth_pubkey, wallet]);

  // fetch proofs from `@/lib/headstash/proofData.ts`
  useEffect(() => {
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

  // resets proofs
  const resetProofs = () => {
    setProofs('');
  };
  // TODO: manual fetch proof button


  // set the signed claim message. 
  useEffect(() => {
    setSignedMessage({ claim_msg: claimMsg, signature })
  }, [signature, claimMsg])




  if (!isClient) return null;

  // create feegrant
  const feegrant = async (proofs: string[]) => {
    try {
      // Check if eth_pubkey is provided and fetch data
      if (!proofs) {
        console.error("eth_pubkey is required");
        return err;
      }

      // Set loading state
      setLoading(true);

      const fetchHeadstashData = async (eth_pubkey: string) => {
        try {
          if (status === 'Connected' && eth_pubkey) {
            const matchedData = headstashData.find((data) => data.address === eth_pubkey);
            if (matchedData) {
              // Set the amount from the matched data
              setAmount(matchedData.amount);
            } else {
              // Handle the case when no matching data is found
              setAmount('Not Eligible')
            }
          }
        } catch (error) {
          setAmount('fetch if eligible error');
        }
      };
      // Fetch data using fetchHeadstashData function
      await fetchHeadstashData(eth_pubkey);

      // Check if there is data available
      if (amount === 'Not Eligible') {
        console.error("No data available for the provided eth_pubkey. Cannot request from faucet.");
        return;
      }

      // Continue with the fee grant logic
      const aliceSigner: OfflineDirectSigner = await getAliceSignerFromMnemonic();
      const signingClient = await SigningStargateClient.connectWithSigner(
        rpc,
        aliceSigner,
      );
      const alice = (await aliceSigner.getAccounts())[0].address;
      const result = await signingClient.sendTokens(
        alice,
        address,
        [{ denom: "uterpx", amount: "50000" }],
        {
          amount: [{ denom: "uterpx", amount: "5000" }],
          gas: "200000",
        },
        "Headstash Faucet"
      );

      console.log("FeeGrant Result:", result);

      if (result.success) {
        // Update headstashState to 'claimed'
        setFeegrantState('claimed');
      }

      // Reset loading state once the transaction is complete
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

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
      // ensure metamask is connected
      if (!window.ethereum || !window.ethereum.selectedAddress) {
        console.error("MetaMask not connected or address not available");
        return;
      }

      const terpAddress: string = address.toString();
      const from = window.ethereum.selectedAddress;
      const cosmosWallet = terpAddress;
      const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
      const sign = await window.ethereum.request({
        method: 'personal_sign',
        params: [msg, from],
      });

      const sig = {
        message: cosmosWallet,
        signatureHash: sign,
        address: from,
        timestamp: new Date().toISOString(),
      };

      console.log("Personal Sign Signature:", sig);

      // Save verification details to local storage if available
      if (isClient && typeof localStorage !== "undefined") {
        localStorage.setItem("ethSigDetails", JSON.stringify(sig));
      }

      // Update state with verification details
      setEthSigDetails(sig);
      setIsVerified(true);

      // Save verification details to local storage
    } catch (err) {
      console.error(err);
    }
  };

  // claim headstash 
  const executeContract = async () => {
    try {
      // Ensure Keplr is connected
      if (!wallet || status !== 'Connected') {
        console.error("Keplr not connected");
        return;
      }

      if (!amount) {
        console.error("Invalid 'amount' value:", amount);
        return; // or handle the error in an appropriate way
      }
      const contractAddress = "terp10emt4hxmeyr8mjxayyt8huelzd7fpntmly8vus5puelqde6kn8xqp0gcq2"
      const executeMsg = {
        claim: {
          amount: amount,
          eth_pubkey: eth_pubkey,
          eth_sig: ethSigDetails ? ethSigDetails.signatureHash.slice(2) : '', // Remove '0x' prefix
          proof: proofs,
        },
      };
      console.log("Execute Message:", executeMsg);

      const msgExecute: MsgExecuteContract = {
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: {
          sender: address,
          contract: contractAddress,
          msg: toUtf8(JSON.stringify(executeMsg)),
          funds: [],
        },
      };

      const fee = {
        amount: [{ denom: "uthiolx", amount: "5000" }],
        gas: "500000",
      };

      // Use Keplr signer
      const offlineSigner = getOfflineSignerDirect(chainNames_1[0]);
      const client = await SigningCosmWasmClient.connectWithSigner(
        "https://terp-testnet-rpc.itrocket.net",
        offlineSigner
      );

      console.log("Client:", client);
      const result = await client.signAndBroadcast(address, [msgExecute], fee);
      assertIsDeliverTxSuccess(result);

      setExecutionResult(`Transaction sent successfully: ${result.transactionHash}`);
      console.log("Execution Result:", result);
    } catch (error) {
      setExecutionResult(`Error: ${error.message}`);
      console.error("Execution Error:", error);
    }
  };

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
            Cosmos PubKey: <br /> {address}
          </h2>
          <br />

          <button
            style={{
              width: '260px',
              padding: '12px',
              backgroundColor: '#181A49',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}

            onClick={async () => {
              await disconnect();
            }}
          >

            Disconnect
          </button>
        </>
      );
    }

    return (
      <div className="flex w-full items-center space-x-4 pb-8 pt-4 md:">
        <button
          onClick={() => connect()}
          style={{
            width: '260px',
            padding: '12px',
            backgroundColor: '#6C8DFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >Connect</button>
      </div>
    );
  };;

  return (
    <main className="claim-head">
      <div className="steps-container">

        <div className="steps-card">
          <div className="inner-card">
            <div className="step-one-card">
              <PageHeaderHeading>1. Connect Metamask</PageHeaderHeading>
              <br />
              <MetamaskConnectButton handleEthPubkey={handleEthPubkey} />
              <br />
              <PageHeaderDescription>Your Headstash Amount: <br /> </PageHeaderDescription>
              <h2 className="center">
                {amount !== 'Not Eligible' ? formattedTerpAmount : 'Not Eligible'}
                <br />
                {amount !== 'Not Eligible' ? formattedTerpAmount : ''}
              </h2>
            </div>
          </div>
        </div>

        <div>
          {amount !== 'Not Eligible' ? (
            <div>
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
                       className="buttonStyle"
                      onClick={handlePersonalSign}
                      disabled={isVerified}
                    >
                      Sign & Verify
                    </button>
                    <div></div>
                    <br />
                    {ethSigDetails ? (
                      <PageHeaderDescription >
                        <p>Signature Hash: <br /> {getShortSig(ethSigDetails.signatureHash)}</p>
                      </PageHeaderDescription>
                    ) : null}
                    <div></div>
                    {ethSigDetails ? (
                      <PageHeaderDescription>
                        <p>Metamask PubKey:<br /> {ethSigDetails.address}</p>
                      </PageHeaderDescription>
                    ) : null}
                    <br />
                    <p>Merkle Proofs:</p>
                    <div className="proof-window">
                      {proofs ? (
                        <PageHeaderDescription >
                          <p> <br /> {proofs}</p>
                        </PageHeaderDescription>
                      ) : null}
                    </div>


                  </div>
                </div>
              </div>
              <div className="steps-card">
                <div className="inner-card">
                  <div className="step-one-card">
                    <PageHeaderHeading>4. Setup Terp Account & <br /> Claim Your Headstash</PageHeaderHeading>
                    <PageHeaderDescription>
                      Transactions on Terp Network require fee's, <br /> We've got you covered for this one! 👍
                    </PageHeaderDescription>
                    <br />
                    <br />
                      <div>
                    <button className="secondButtonStyle"
                      onClick={() => feegrant(eth_pubkey)}
                      disabled={loading}>
                      {loading ? 'Processing...' : feegrantState === 'claimed' ? 'Headstash Claimed Successfully' : ' a. Setup Account'}
                    </button>
                    <button className="buttonStyle"
                      onClick={executeContract}>
                      {headstashState === 'claimed' ? 'Headstash Claimed' : ' b. Claim Headstash'}
                    </button>
                    </div>
          
                    <br />
                  </div>
                </div>
              </div>
            </div>
          ) : (
      <BlurredContent/>
          )}
        </div>
      </div>
    </main>
  )
}
