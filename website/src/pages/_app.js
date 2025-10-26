import React, { useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Load Poppins font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <>
      <Head>
        <title>TheUSDOX - The On-Chain Dollar</title>
        <meta name="description" content="TheUSDOX - Revolutionary on-chain dollar bringing transparency, speed, and audibility to DeFi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://cdn.jsdelivr.net/gh/VKATHUSHAN/crypto-assests@main/usdox-logo.png" />
        
        {/* Open Graph */}
        <meta property="og:title" content="TheUSDOX - The On-Chain Dollar" />
        <meta property="og:description" content="Fast, stable, and auditable. Experience the future of decentralized currency." />
        <meta property="og:image" content="https://cdn.jsdelivr.net/gh/VKATHUSHAN/crypto-assests@main/usdox-logo.png" />
        <meta property="og:url" content="https://theusdox.com" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TheUSDOX - The On-Chain Dollar" />
        <meta name="twitter:description" content="Fast, stable, and auditable. Experience the future of decentralized currency." />
        <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/VKATHUSHAN/crypto-assests@main/usdox-logo.png" />
      </Head>
      
      <Component {...pageProps} />
    </>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};