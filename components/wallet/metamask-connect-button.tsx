import React, { useEffect, useState } from "react";


const MetamaskConnectButton: React.FC<{ setError: (error: string | null) => void }> = ({
  setError,
}) => {
  const [walletAddress, setWallet] = useState<string>("");
  

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
      setWallet(walletResponse.address);
    } catch (e) {
    }
  };

  const addWalletListener = () => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setError(null);
        } else {
          setWallet("");
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
      setWallet(address.address);
      addWalletListener();
    } catch (e) {
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <button className="wallet-button" onClick={walletConnectHandler}>
        {walletAddress.length > 0 ? (
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
    </div>
  );
};

export default MetamaskConnectButton;
