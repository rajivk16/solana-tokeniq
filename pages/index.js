// import { useCallback, useEffect, useState } from 'react'
// import Button from '../components/Button'
// import ClickCount from '../components/ClickCount'
// import styles from '../styles/home.module.css'

// function throwError() {
//   console.log(
//     // The function body() is not defined
//     document.body()
//   )
// }

// function Home() {
//   const [count, setCount] = useState(0)
//   const increment = useCallback(() => {
//     setCount((v) => v + 1)
//   }, [setCount])

//   useEffect(() => {
//     const r = setInterval(() => {
//       increment()
//     }, 1000)

//     return () => {
//       clearInterval(r)
//     }
//   }, [increment])

//   return (
//     <main className={styles.main}>
//       <h1>Fast Refresh Demo</h1>
//       <p>
//         Fast Refresh is a Next.js feature that gives you instantaneous feedback
//         on edits made to your React components, without ever losing component
//         state.
//       </p>
//       <hr className={styles.hr} />
//       <div>
//         <p>
//           Auto incrementing value. The counter won't reset after edits or if
//           there are errors.
//         </p>
//         <p>Current value: {count}</p>
//       </div>
//       <hr className={styles.hr} />
//       <div>
//         <p>Component with state.</p>
//         <ClickCount />
//       </div>
//       <hr className={styles.hr} />
//       <div>
//         <p>
//           The button below will throw 2 errors. You'll see the error overlay to
//           let you know about the errors but it won't break the page or reset
//           your state.
//         </p>
//         <Button
//           onClick={(e) => {
//             setTimeout(() => document.parentNode(), 0)
//             throwError()
//           }}
//         >
//           Throw an Error
//         </Button>
//       </div>
//       <hr className={styles.hr} />
//     </main>
//   )
// }

// export default Home

// pages/index.js
// import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
// import AnimatedBackground from '../components/AnimatedBackground';
// import FloatingObjects from '../components/FloatingObjects';
// import Swap from '../components/Swap';

// export default function Home() {
//   return (
//     <div className="relative flex flex-col items-center justify-center min-h-screen py-2 overflow-hidden">
//       <AnimatedBackground />
//       <FloatingObjects />
//       <div className="relative z-20 flex flex-col items-center">
//         <WalletMultiButton className="mb-4" />
//         <WalletDisconnectButton className="mb-4" />
//         <Swap />
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { WalletMultiButton, WalletDisconnectButton, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '../context/WalletContext';
import AnimatedBackground from '../components/AnimatedBackground';
import FloatingObjects from '../components/FloatingObjects';

export default function Home() {
  const { connected, publicKey, fetchSwapQuote, createAndSignSwapTransaction } = useWalletModal();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSwap = async () => {
    if (!connected) {
      setError("Wallet not connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch swap quote
      const swapQuote = await fetchSwapQuote(
        'So11111111111111111111111111111111111111112', // SOL mint address
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint address
        100000000, // 0.1 SOL in lamports
        50 // 0.5% slippage in basis points
      );

      setQuote(swapQuote);

      // Perform swap transaction
      const txid = await createAndSignSwapTransaction(swapQuote, wallet);
      console.log(`Transaction ID: ${txid}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-8 overflow-hidden bg-gray-50">
      <AnimatedBackground />
      <FloatingObjects />
      <div className="relative z-20 flex flex-col items-center w-full max-w-lg px-8 py-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-8">Solana Swap</h1>
        <div className="mb-4">
          <WalletMultiButton />
        </div>
        <div className="mb-4">
          <WalletDisconnectButton />
        </div>
        {connected && (
          <>
            <button onClick={handleSwap} className="mb-4" disabled={loading}>
              {loading ? 'Processing...' : 'Perform Swap'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {quote && (
              <div className="mt-4 p-4 bg-gray-200 rounded shadow w-full text-center">
                <h3 className="font-bold mb-2">Swap Quote</h3>
                <p>Out Amount: {quote.outAmount}</p>
                <p>Price Impact: {quote.priceImpactPct}%</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
