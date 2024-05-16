import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { getSwapRoutes } from '../utils/jupiter';

const Swap = () => {
  const { publicKey } = useWallet();
  const [inputMint, setInputMint] = useState('');
  const [outputMint, setOutputMint] = useState('');
  const [amount, setAmount] = useState('');
  const [routes, setRoutes] = useState([]);

  const fetchRoutes = async () => {
    const routes = await getSwapRoutes(inputMint, outputMint, amount);
    setRoutes(routes);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Input Mint"
        value={inputMint}
        onChange={(e) => setInputMint(e.target.value)}
      />
      <input
        type="text"
        placeholder="Output Mint"
        value={outputMint}
        onChange={(e) => setOutputMint(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={fetchRoutes}>Get Routes</button>
      {routes.length > 0 && (
        <div>
          <h2>Swap Routes</h2>
          <pre>{JSON.stringify(routes, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Swap;
