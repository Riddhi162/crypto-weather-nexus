import "@/styles/globals.css";
import { ReduxProvider } from '../components/providers/ReduxProvider';
import React, { useMemo } from 'react';
function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}

export default MyApp;