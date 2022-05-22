import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Nav from '../components/server/nav'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <>
    <SessionProvider session={session}>
      <Nav />
      <Component {...pageProps} />
    </SessionProvider>
  </>
}

export default MyApp
