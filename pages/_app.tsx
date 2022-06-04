import '../styles/globals.css'
import "@fontsource/plus-jakarta-sans/400.css"
import "@fontsource/plus-jakarta-sans/700.css"
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import Cookies from '../components/client/cookies'
import dynamic from 'next/dynamic'

const Nav = dynamic(() => import('../components/server/nav'), {
  loading: () => <nav className='h-[65px] md:h-[69px]' />
})

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <>
    <Head>
    </Head>
    <SessionProvider session={session}>
      <Cookies />
        <Nav />
      <Component {...pageProps} />
    </SessionProvider>
  </>
}

export default MyApp
