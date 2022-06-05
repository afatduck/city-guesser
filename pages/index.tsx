import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import gamemodes from '../gamemodes.json'
import Multiplier from '../components/reusable/multiplier'

const Home: NextPage = () => {

  return (
    <>
    <Head>
      <title>Welcome! | EarthGuesser</title>
    </Head>
    <div className='grow md:max-w-3xl max-w-xl mx-auto w-full pt-16 flex-col flex px-8 text-justify' >
      <h1 className='md:text-6xl text-5xl font-extrabold text-center leading-[1.1] mb-12'>
        Welcome to <span className='text-green-500'>EarthGuesser!</span>
      </h1>
      <p>
        Hello, thank you for visiting EarthGuesser. 👋🏻 This is a ripoff of the 
        popular game <a href='https://www.geoguessr.com/' 
        target='_blank' rel='noopener noreferrer' className='text-green-600'>
          GeoGuessr
        </a>. In case you are not familiar with the game, it is a guessing game
        where you are placed in a randomly generated place on Earth and you
        have to mark the location as close to the actual location as possible.
        The advantage of this game compared to GeoGuessr is that you can play
        as much as you want for free.
      </p>
      <h2 className='font-bold text-2xl mt-8 mb-4'>Avaliable gamemodes: </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-40'>
        {gamemodes.map((gamemode, index) =>

        <Link href={`/play/${gamemode.code.toLowerCase()}`} key={index}>
        <article className="rounded-lg overflow-hidden bg-neutral-800 
        shadow-md cursor-pointer relative">

          <Image width={576} height={360} 
          src={`https://storage.googleapis.com/earthguesser-bucket/thumbnails/${gamemode.code}.jpg`}
          layout='responsive'
          alt={`${gamemode.name} thumbnail.`} />

          <div className="px-6 py-4">
          <h3 className='font-bold'>{gamemode.name}</h3>
          <p className='text-sm text-neutral-300'>{gamemode.description}</p>
          </div>

          <Multiplier multiplier={gamemode.multiplier} 
          className='absolute top-4 right-4 text-xs bg-neutral-800
          py-1 px-2 rounded-md shadow-md drop-shadow-sm' />

        </article></Link>)}
      </div>
    </div>
    </>
  )
  
}

export default Home
