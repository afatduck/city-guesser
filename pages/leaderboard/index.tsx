import { useSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react'
import Image from 'next/image';

import prisma from '../../utils/prisma';

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
                    <Image className='w-7 h-7 rounded-full mr-2' src={user.image.startsWith('http') ? user.image : `/avatars/${user.image}`}
                    width={28} height={28} alt="Avatar" />
                    <span className='font-bold mr-auto ml-2'>{user.username || user.name}</span>
                    <span className='w-16 text-right'>{user.best_score}</span>
                    <span className='w-16 text-right'>{user.total_score}</span>
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
            total_score: 'desc',
        },
        select: {
            id: true,
            name: true,
            total_score: true,
            best_score: true,
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
        total_score: number,
        best_score: number,
        image: string,
        username: string,
    }[]
}