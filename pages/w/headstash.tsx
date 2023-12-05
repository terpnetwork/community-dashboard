import React, { useEffect, useState } from "react";
import { toast } from 'react-hot-toast'
import { useChain } from "@cosmos-kit/react";
import MetamaskConnectButton from "@/components/wallet/metamask-connect-button";
import { PageHeaderDescription, PageHeaderHeading } from "@/components/utils/page-header";
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { useIsClient } from "@/hooks";
import { SignedMessage } from "@/contracts/headstash";
import { headstashData } from '../../lib/headstash/headstashData';
import { proofData } from '../../lib/headstash/proofData';
import { toUtf8 } from "@cosmjs/encoding";
import { assertIsDeliverTxSuccess } from "@cosmjs/stargate"
import { SigningCosmWasmClient, MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { getShortSig } from "@/utils/getShortSig";
import { useSignMessage } from "wagmi";
import { recoverMessageAddress } from "viem";
import { Button } from "@/components/ui/button";
// import { useRouter } from "next/router";
// import { SignMessage } from "@/components/wallet/metamask/signMsg";
// import { useContracts } from "@/contracts/context";

// const merkleRoot: string = '77fb25152b72ac67f5a155461e396b0788dd0567ec32a96f8201b899ad516b02';
const chainNames_1 = ["terpnettestnet"];
const endpoint = "https://terp-testnet-rpc.itrocket.net"; 
type ClaimState = 'loading' | 'not_claimed' | 'claimed' | 'no_allocation'


export default function Headstash() {
  // const router = useRouter();
  // const headstashAirdropContract = useContracts().headstashAirdrop
  const { connect, disconnect, getOfflineSignerDirect, address, wallet, status, } = useChain(chainNames_1[0]); // cosmos-kit
  const isClient = useIsClient();
  const [amount, setAmount] = useState('');
  const [claimMsg, setClaimMsg] = useState('');
  const [eth_pubkey, setEthPubkey] = useState('');
  const [eth_sig, setEthSig] = useState('');
  const [executionResult, setExecutionResult] = useState('');
  const formattedTerpAmount = `${amount.slice(0, 5)}.${amount.slice(5)} $TERP`;
  const formattedThiolAmount = `${amount.slice(0, 5)}.${amount.slice(5)} $THIOL`;
  const [headstashState, setHeadstashState] = useState<ClaimState>('loading');
  const [feegrantState, setFeegrantState] = useState<ClaimState>('not_claimed');
  const [loading, setLoading] = useState(false);
  const [proofs, setProofs] = useState<string[]>(['']);
  const [signature, setSignature] = useState('');
  const [signedMessage, setSignedMessage] = useState<SignedMessage | undefined>(undefined);
  const contractAddress = "terp1s7xusjh42jlakhgs2a6wgxlvf9ynxuz87z6tpg2wwam7z650hnysp8v93n";
  const [isVerified, setIsVerified] = useState(false);

  // WALLET CONFIG //

  // set eth_pubkey
  const handleEthPubkey = (eth_pubkey: string) => {
    setEthPubkey(eth_pubkey);
  };

  useEffect(() => {
    const handleWalletDisconnect = () => {
      // eth_pubkey null on wallet disconnect
      setEthPubkey('');
    };

    // Check if window.ethereum is available
    if (window.ethereum) {
      // Listen for wallet disconnect events
      window.ethereum.on('disconnect', handleWalletDisconnect);
    }

    // Cleanup the event listener when the component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.off('disconnect', handleWalletDisconnect);
        resetProofs();
      }
    };
  }, []);

  // useEffect(() => {
  //   ;(async () => {
  //     if (variables?.message && signMessageData) {
  //       const recoveredAddress = await recoverMessageAddress({
  //         message: variables?.message,
  //         signature: signMessageData,
  //       })
  //       setRecoveredAddress(recoveredAddress)
  //     }
  //   })()
  // }, [signMessageData, variables?.message])


  // connect Keplr
  useEffect(() => {
    const initializeKeplr = async () => {
      try {
        if (isClient && status === 'Disconnected') {
            await connect();
          }
      } catch (error) {
        toast.error("Error, initializing Keplr")
        console.error(error);
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
            setProofs(['No proofs were found']);
            console.log(proofs)
          }
        }
      } catch (error) {
        console.error('Error fetching Proof data', error);
        setProofs(['Error fetching data']);
      }
    };
    void fetchProofs(eth_pubkey);
  }, [status, eth_pubkey, wallet]);

  // resets proofs
  const resetProofs = () => {
    setProofs(['']);
  };
  // TODO: manual fetch proof button


  // set the signed claim message. 
  useEffect(() => {
    setSignedMessage({ claim_msg: claimMsg, signature })
  }, [signature, claimMsg])

  if (!isClient) return null;

  // create faucet 
  const faucet = async (proofs: string[]) => {
    try {
      // check if proofs exist
      if (!proofs) {
        toast.error("eth_pubkey is required");
        console.error("eth_pubkey is required");
        const err = new Error("eth_pubkey is required");
        return err;
      }

      // set loading state to 'true'
      setLoading(true);

      // TODO: Replace 'ip', 'port', 'chain_id', and 'address' with your actual values
      const testnetFaucetEndpoint = `https://faucet.terp.network/90u-2/${address}`;
      // const mainnetFaucetEndpoint = `https://faucet.reece.sh/uni-6/${address}`;

      // make the GET response
      const response = await fetch(testnetFaucetEndpoint);

      // check if the request was successful (status code 2xx)
      if (response.ok) {
        const result = await response.json();

        console.log("FeeGrant Result:", result);
        setFeegrantState('claimed');
      } else {
        console.error("FeeGrant request failed with status:", response.status);
      }

      // Reset loading state once the transaction is complete
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // handle personal_sign
  const handlePersonalSign = async () => {
    try {
      // ensure metamask is connected
      if (status !== 'Connected' || !window.ethereum.selectedAddress) {
        toast.error(" Unable to sign verification message. Please make sure both Metamask & the desired Interchain Terp account is connected.");
        return;
      }
      if (address !== undefined) {
        const terpAddress: string = address.toString();
        const from = window.ethereum.selectedAddress;
        const cosmosWallet = terpAddress;
        const msg = `0x${Buffer.from(cosmosWallet, 'utf8').toString('hex')}`;
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
      } else {
       toast.error("Error Updating ethSig.")
      }
      // Save verification details to local storage
    } catch (err) {
      console.error(err);
      toast.error("Message Rejected.")
    }
  };

  // claim headstash 
  const executeContract = async () => {
    try {
      // ensure keplr is connected
      if (!wallet || status !== 'Connected') {
        console.error("Keplr not connected");
        return;
      }

      if (!amount) {
        toast.error("Invalid amount value")
          console.error("Invalid 'amount' value:", amount);
        return;
      }
      const executeMsg = {
        claim: {
          amount: amount,
          eth_pubkey: eth_pubkey,
          eth_sig: ethSigDetails ? ethSigDetails.signatureHash.slice(2) : '', // Remove '0x' prefix
          proof: proofs,
        },
      };
      // console.log("Execute Message:", executeMsg);

      const msgExecute: MsgExecuteContractEncodeObject = {
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

      // Use keplr signer
      const offlineSigner = getOfflineSignerDirect();
      const client = await SigningCosmWasmClient.connectWithSigner(
        endpoint,
        offlineSigner
      );

      console.log("Client:", client);
      const result = await client.signAndBroadcast(address ?? "", [msgExecute], fee);
      assertIsDeliverTxSuccess(result);
      console.log("Execution Result:", result.transactionHash);
      toast.success(`[View Tx Hash](https://ping.pub/terp/tx/${result.transactionHash})`);
    } catch (error) {
      toast.error(`Claim Headstash: ${error}`);
      console.error("Execution Error:", error);
    }
  };

  // cosmos wallet connect
  const getGlobalbutton = () => {
    if (status === "Connecting") {
      return (
        <Button onClick={() => connect()}>
          <PaperPlaneIcon className="mr-2 h-4 w-4" />
          {`Connecting ${wallet?.prettyName}`}
        </Button>
      );
    }
    if (status === "Connected") {
      return (
        <>
          <h2 className="font-heading text-xl font-bold">    Terp Network Public Key <br /></h2>
          <PageHeaderDescription>
            {address}
          </PageHeaderDescription>
          <br />
          <br />
          <button
            className="thirdButton"
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
              <PageHeaderDescription>First let's check if your account was included in the headstash airdrop. Press the button to connect with a Metamask Wallet. </PageHeaderDescription>
              <br />
              <br />  
              <MetamaskConnectButton handleEthPubkey={handleEthPubkey} />
              <br />
              <PageHeaderHeading>Your Headstash Amount: <br /> </PageHeaderHeading>
              <div className="steps-container center">
                <PageHeaderHeading className="terpAmount">
                  {amount !== 'Not Eligible' ? formattedTerpAmount : 'Not Eligible'}
                </PageHeaderHeading>
                <PageHeaderHeading className="thiolAmount">
                  {amount !== 'Not Eligible' ? formattedThiolAmount : ''}
                </PageHeaderHeading>
              </div>
            </div>
          </div>
        </div>

        <div>
        {amount !== 'Not Eligible' && eth_pubkey ? (
            <div>
              <div className="steps-card">
                <div className="inner-card">
                  <div className="step-one-card">
                    <PageHeaderHeading>2. Connect Cosmos Wallet</PageHeaderHeading>
                    <PageHeaderDescription>Nice! Now, choose a compatible wallet to claim your headstash allocation.  </PageHeaderDescription>
                    <br />
                    <br />
                    {getGlobalbutton()}
                  </div>
                </div>
              </div>
              <div className="steps-card">
                <div className="inner-card">
                  <div className="step-one-card">
                    <PageHeaderHeading>3. Verify Metamask Ownership</PageHeaderHeading>
                    <PageHeaderDescription>Next, prompt Metamask to sign a message containing your Interchain wallet public key. Before signing, ensure the public account connected is included in the Metamask app.</PageHeaderDescription>
                    <br />
                    <button
                      className="buttonStyle"
                      onClick={handlePersonalSign}
                      style={{filter: window.ethereum.selectedAddress || status === "Connected" ? 'none' : 'blur(5px)'}} 
                      // disabled={!wallet || status !== 'Connected' || !window.ethereum.selectedAddress || isVerified}
                    >
                      Sign & Verify
                    </button>
                    <div></div>
                  {/*<SignMessage/>*/}
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
                      <button className="buttonStyle"
                        onClick={() => faucet(proofs)}
                        style={{ filter: isVerified ? 'none' : 'blur(5px)' }}
                        disabled={!isVerified || loading}>
                        {loading ? 'Processing...' : feegrantState === 'claimed' ? 'Account funded!' : ' a. Setup Account'}
                      </button>
                      <br />
                      <br />
                      <button
                        className="buttonStyle"
                        onClick={executeContract}
                        disabled={!isVerified || loading}
                        style={{ filter: isVerified ? 'none' : 'blur(5px)' }}
                      >
                        {headstashState === 'claimed' ? 'Headstash Claimed' : ' b. Claim Headstash'}
                      </button>
                    </div>

                    <br />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ filter: 'blur(5px)', pointerEvents: 'none' }}>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
