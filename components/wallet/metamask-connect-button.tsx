import React, { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'
import {getShortAddress} from '@/components/badges/utils/getShortAddress' 

interface MetamaskConnectButtonProps {
  handleEthPubkey: (eth_pubkey: string) => void;
}

const MetamaskConnectButton: React.FC<MetamaskConnectButtonProps> = ({
  handleEthPubkey,
}) => {
  const [eth_pubkey, setEthPubkey] = useState<string>("");
  const { address, connector, isConnected, status  } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  const connectWallet = async () => {
    if (status !== 'connected' ) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userAddress = addressArray[0];
        const obj = {
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error(
        "You must install Metamask, a virtual Ethereum wallet, in your browser."
      );
    }
  };

  const getConnectedMetamaskWallet = async () => {
    if (status === 'connected') {
      try {
        const addressArray = await (window as any).ethereum.request({
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
      } catch (err) {
        throw err;
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
    }
  };

  const walletDisconnectHandler = async () => {
    try {
      await disconnect();
      setEthPubkey("");
    } catch (e) {
    }
  };

  const addWalletListener = () => {
    if (status === 'connected') {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
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
    }
  };

  useEffect(() => {
    load().then(() => {
      handleEthPubkey(eth_pubkey);
    });
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
