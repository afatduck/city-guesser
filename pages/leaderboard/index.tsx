import { useSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react'
import Image from 'next/image';

import prisma from '../../utils/prisma';
import { formatImageURL, shortenNumber } from '../../utils/misc';
import Link from 'next/link';

function Index({leaderboard}: Props) {

    const session = useSession()
    const userId = session?.data?.user?.id    

  return (
    <>
    <Head>
        <title>Leaderboard | EarthGuesser</title>
    </Head>
    <div className='grow max-w-xl mx-auto w-full pt-16 flex-col px-6'>
    <div className='flex items-center px-2 border-b border-b-neutral-700'>
        <h2 className='text-2xl font-bold pb-2'>
            Leaderboard
        </h2>
        <span className='text-xs mr-8 ml-auto max-h-full'>BEST HIT</span>
        <span className='text-xs'>SCORE</span>
    </div>
      <div className='overflow-y-auto grow'>
      {
          leaderboard.map(user => (
                <div className={`flex items-center bg-neutral-800 my-2 rounded-md px-4
                justify-between p-2 ` + (user.id === userId && "text-green-500")} key={user.id}>

                    <Link href={`/user/${user.id}`}>
                        <a className='flex items-center mr-auto'>
                            <Image className='w-7 h-7 rounded-full mr-2' 
                                src={formatImageURL(user.image)}
                                width={28} height={28} alt="Avatar" />
                            <span className='font-bold ml-2'>{user.username || user.name}</span>
                        </a>
                    </Link>

                    <span className='w-16 text-right'>{user.bestScore}</span>
                    <span className='w-16 text-right'>{shortenNumber(user.totalScore)}</span>
                </div>
            ))
      }
      </div>
    </div>
    </>
  )
}

export default Index

export async function getServerSideProps() {
    const leaderboard = await prisma.user.findMany({
        orderBy: {
            totalScore: 'desc',
        },
        select: {
            id: true,
            name: true,
            totalScore: true,
            bestScore: true,
            image: true,
            username: true,
        },
    });
    
    return {
        props: {
            leaderboard,
        },
    }
}

interface Props {
    leaderboard: {
        id: string,
        name: string,
        totalScore: number,
        bestScore: number,
        image: string,
        username: string,
    }[]
}