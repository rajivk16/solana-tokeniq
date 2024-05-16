// pages/_app.js
import '../global.css';
import dynamic from 'next/dynamic';
import App from 'next/app'; // Import App from next/app


const WalletContextProvider = dynamic(() => import('../context/WalletContext').then(mod => mod.WalletContextProvider), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <WalletContextProvider>
      <Component {...pageProps} />
    </WalletContextProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
