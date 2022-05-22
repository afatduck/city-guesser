import { PrismaClient } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react'

const prisma = new PrismaClient();

function Index({leaderboard}: Props) {

    const session = useSession()
    const userId = session?.data?.user?.id

  return (
    <div className='grow max-w-xl mx-auto w-full pt-16 flex-col'>
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
                justify-between p-2 ` + (user.id === userId && "text-green-500")}>
                    <img className='w-7 h-7 rounded-full mr-2' src={user.image}
                    width={28} height={28} />
                    <span className='font-bold mr-auto ml-2'>{user.name}</span>
                    <span className='w-16 text-right'>{user.best_score}</span>
                    <span className='w-16 text-right'>{user.total_score}</span>
                </div>
            ))
      }
      </div>
    </div>
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
        },
    });
    console.log(leaderboard);
    
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
    }[]
}