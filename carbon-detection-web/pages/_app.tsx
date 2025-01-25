import { AppProvider } from "../context/AppContext";
import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <AppProvider>

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <Component {...pageProps} />
    </AppProvider>
    </>
  );
}
