// context/WalletContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WalletContext = createContext();

export const WalletContextProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const initializeWallet = async () => {
      const Wallet = (await import('@project-serum/sol-wallet-adapter')).default;
      const providerUrl = 'https://www.sollet.io';
      const walletInstance = new Wallet(providerUrl);

      walletInstance.on('connect', (publicKey) => {
        console.log('Connected to ' + publicKey.toBase58());
        setPublicKey(publicKey);
        setConnected(true);
      });

      walletInstance.on('disconnect', () => {
        console.log('Disconnected');
        setPublicKey(null);
        setConnected(false);
      });

      setWallet(walletInstance);
    };

    initializeWallet();
  }, []);

  const connectWallet = async () => {
    if (wallet) {
      await wallet.connect();
    }
  };

  const disconnectWallet = async () => {
    if (wallet) {
      await wallet.disconnect();
    }
  };

  const sendTransaction = async (transaction) => {
    if (wallet && publicKey) {
      const { Connection } = await import('@solana/web3.js');
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;
      const signed = await wallet.signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction({
        signature: txid,
        blockhash,
        lastValidBlockHeight,
      });
      return txid;
    }
    return null;
  };

  const value = useMemo(
    () => ({
      wallet,
      publicKey,
      connected,
      connectWallet,
      disconnectWallet,
      sendTransaction,
    }),
    [wallet, publicKey, connected]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => useContext(WalletContext);
