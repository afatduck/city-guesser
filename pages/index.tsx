import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import styles from "../styles/page-styles/index.module.css"

const Home: NextPage = () => {

  return (
    <>
    <Head>
      <title>Welcome! | EarthGuesser</title>
    </Head>
    <div className={'grow max-w-xl mx-auto w-full pt-16 flex-col flex px-8 text-justify ' + styles.body} >
      <h1 className='md:text-6xl text-5xl font-extrabold text-center leading-[1.1] mb-12'>
        Welcome to <span className='text-green-500'>EarthGuesser!</span>
      </h1>
      <p>
        This is a rip-off of the GeoGuessr game. Since GeoGuessr has
        very limited playing time (unless you pay), I decided to make a game that is
        baisically the same, but completely free.
      </p>
      <p>
        EarthGuesser is currently in very early development, so it&apos;s not the best thing ever.
        Until further updates, you can play
        only the completely random gamemode (so expect being put in deserts, 
        forests, seas and other unhelpful locations). 
        You can also expect bugs, like map not loading, or your
        score not being saved. 
      </p>

      <Link href='/play'>
        <a className=' text-3xl py-6 w-[80%] font-extrabold mt-16
        bg-green-600 rounded-xl mx-auto mb-24 text-center'>
          PLAY
        </a>
      </Link>
    </div>
    </>
  )
  
}

export default Home
