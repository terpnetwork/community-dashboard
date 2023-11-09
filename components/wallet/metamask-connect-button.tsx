import React, { useEffect, useState } from "react";

interface MetamaskConnectButtonProps {
  handleEthPubkey: (eth_pubkey: string) => void;
}

const MetamaskConnectButton: React.FC<MetamaskConnectButtonProps> = ({
  handleEthPubkey,
}) => {
  const [eth_pubkey, setEthPubkey] = useState<string>("");


  const connectWallet = async () => {
    if ((window as any).ethereum) {
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
    if ((window as any).ethereum) {
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

  const addWalletListener = () => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setEthPubkey(accounts[0]);
          setError(null);
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
      // After loading, call the callback to provide the wallet address
      handleEthPubkey(eth_pubkey);
    });
  }, [eth_pubkey, handleEthPubkey]);

  return (
    <div>
      <button style={{
                  width: '260px',
                  padding: '12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }} 
      className="wallet-button" onClick={walletConnectHandler}>
        {eth_pubkey.length > 0 ? (
          String(eth_pubkey).substring(0, 6) +
          "..." +
          String(eth_pubkey).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
    </div>
  );
};

export default MetamaskConnectButton;
