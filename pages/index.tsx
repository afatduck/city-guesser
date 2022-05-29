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
        This is a total rip-off of the GeoGuessr game. Since GeoGuessr has
        very limited playing time (unless you pay, and come on you will not
        pay to play GeoGuessr), I decided to make a game that is
        baisically the same, but completely free.
      </p>
      <p>
        Funnily enough, it turns out that rip-offs are completely legal because
        you can&apos;t put copyright on gameplay mechanics, only the assets.
      </p>
      <p>
        The game is currently in very early development, so it&apos;s kinda shit.
        Until further updates (which I will probably never do), you can play
        only the completely random gamemode (so expect being put in deserts, 
        forests, seas and other unhelpful locations). 
        You can also expect bugs, like map not loading, or your
        score not being saved. And lastly, cheating is possible, so I&apos;d
        like to see you try. ^^
      </p>

      <Link href='/play' rel='next'>
        <button className=' text-3xl py-6 w-[80%] font-extrabold mt-16
        bg-green-600 rounded-xl mx-auto mb-24'>
          PLAY
        </button>
      </Link>
    </div>
    </>
  )
  
}

export default Home
