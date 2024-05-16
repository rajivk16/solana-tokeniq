import '../globals.css';
import { WalletContextProvider } from '../context/WalletContext';

function MyApp({ Component, pageProps }) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}

export default MyApp;
