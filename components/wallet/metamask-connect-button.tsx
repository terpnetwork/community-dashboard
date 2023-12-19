import React, { useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
} from 'wagmi'
import {getShortAddress} from '@/components/utils/getShortAddress' 
import toast from "react-hot-toast";

interface MetamaskConnectButtonProps {
  handleEthPubkey: (eth_pubkey: string) => void;
}

const MetamaskConnectButton: React.FC<MetamaskConnectButtonProps> = ({
  handleEthPubkey,
}) => {
  const [eth_pubkey, setEthPubkey] = useState<string>("");
   const {status }= useAccount();
  const { disconnect } = useDisconnect();

  const connectWallet = async () => {
    if (window.ethereum && status !== 'connected' ) {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          address: addressArray[0],
        };
        return obj; 
    } else {
      throw new Error(
        "You must install Metamask, a virtual Ethereum wallet, in your browser."
      );
    }
  };

  const getConnectedMetamaskWallet = async () => {
    if (window.ethereum) {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
          };
        } else {
          throw new Error(
            "Connect to Metamask using the connect wallet button."
          );
        }
    } else {
      throw new Error(
        "You must install Metamask, a virtual Ethereum wallet, in your browser."
      );
    }
  };

  const walletConnectHandler = async () => {
    try {
      const walletResponse = await connectWallet();
      setEthPubkey(walletResponse.address);
    } catch (e) {
    toast.error(`${e}`)
    }
  };

  const walletDisconnectHandler = async () => {
    try {
      await disconnect();
      setEthPubkey("");
    } catch (e) {
  toast.error(`${e}`)
    }
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setEthPubkey(accounts[0]);
        } else {
          setEthPubkey("");
        }
      });
    } else {
      throw Error(
        "You must install Metamask, a virtual Ethereum wallet, in your browser."
      );
    }
  };

  const load = async () => {
    try {
      const address = await getConnectedMetamaskWallet();
      setEthPubkey(address.address);
      addWalletListener();
    } catch (e) {
toast.error(`${e}`)
    }
  };

  useEffect(() => {
    handleEthPubkey(eth_pubkey);
    // load().then(() => {
   
    // });
  }, [eth_pubkey, handleEthPubkey]);



  return (
    <div>
      { eth_pubkey != "" ? (
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
          className="wallet-button"
          onClick={walletDisconnectHandler}
        >
              {getShortAddress(eth_pubkey)}
        </button>
      ) : (
        <button
          style={{
            width: '260px',
            padding: '12px',
            backgroundColor: '#6C8DFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          className="wallet-button"
          onClick={walletConnectHandler}
        >
          {eth_pubkey.length > 0 ? (
            `${eth_pubkey.substring(0, 6)}...${eth_pubkey.substring(38)}`
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      )}
    </div>
  );
};

export default MetamaskConnectButton;