import '../styles/globals.css'
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
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
      <link rel="manifest" href="/site.webmanifest"/>
      <meta name="description" content="A total rip-off of GeoGuesser. More precisely, a free, shit version of it." />
      <meta name="keywords" content="GeoGuesser Free, EarthGuesser" />
    </Head>
    <SessionProvider session={session}>
      <Cookies />
        <Nav />
      <Component {...pageProps} />
    </SessionProvider>
  </>
}

export default MyApp
