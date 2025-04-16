import '@/styles/globals.css'; // or '../styles/globals.css' if that doesn't work
import React from 'react';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
