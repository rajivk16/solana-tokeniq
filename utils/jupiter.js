// // export const getSwapRoutes = async (inputMint, outputMint, amount) => {
// //     const response = await fetch('https://quote-api.jup.ag/v1/quote', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({
// //         inputMint,
// //         outputMint,
// //         amount,
// //         slippage: 1,
// //       }),
// //     });
  
// //     const data = await response.json();
// //     return data;
// //   };
  
// import { Connection, VersionedTransaction, TransactionInstruction, PublicKey } from '@solana/web3.js';
// import fetch from 'cross-fetch';
// import bs58 from 'bs58';

// // Create a connection to the Solana network
// const connection = new Connection('https://api.mainnet-beta.solana.com');

// // Fetch a swap quote from Jupiter API
// export const fetchSwapQuote = async (inputMint, outputMint, amount, slippageBps) => {
//   const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`);
//   const quote = await response.json();
//   return quote;
// };

// // Create and sign a swap transaction using Jupiter API
// export const createAndSignSwapTransaction = async (quoteResponse, wallet) => {
//   const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       quoteResponse,
//       userPublicKey: wallet.publicKey.toString(),
//       wrapAndUnwrapSol: true,
//     }),
//   });
//   const { swapTransaction } = await swapResponse.json();

//   const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
//   const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

//   transaction.sign([wallet.payer]);

//   const rawTransaction = transaction.serialize();
//   const txid = await connection.sendRawTransaction(rawTransaction, {
//     skipPreflight: true,
//     maxRetries: 2,
//   });
//   await connection.confirmTransaction({
//     signature: txid,
//     blockhash: transaction.recentBlockhash,
//     lastValidBlockHeight: transaction.lastValidBlockHeight,
//   });

//   return txid;
// };

import { Connection, VersionedTransaction, PublicKey } from '@solana/web3.js';
import fetch from 'cross-fetch';
import bs58 from 'bs58';

// Create a connection to the Solana network
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Fetch a swap quote from Jupiter API
export const fetchSwapQuote = async (inputMint, outputMint, amount, slippageBps) => {
  const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`);
  const quote = await response.json();
  return quote;
};

// Create and sign a swap transaction using Jupiter API
export const createAndSignSwapTransaction = async (quoteResponse, wallet) => {
  const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: wallet.publicKey.toString(),
      wrapAndUnwrapSol: true,
    }),
  });
  const { swapTransaction } = await swapResponse.json();

  const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

  transaction.sign([wallet.payer]);

  const rawTransaction = transaction.serialize();
  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    maxRetries: 2,
  });
  await connection.confirmTransaction({
    signature: txid,
    blockhash: transaction.recentBlockhash,
    lastValidBlockHeight: transaction.lastValidBlockHeight,
  });

  return txid;
};
