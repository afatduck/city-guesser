import Link from "next/link"
import Image from "next/image"
import { useSession, signIn, signOut } from "next-auth/react"

import Logo from "../../public/logo120.png"
import { Trophy } from "tabler-icons-react"

export default function Nav() {

    const session = useSession();    

    return (
        <nav className="flex px-8 py-4 justify-between items-center 
        border-b-neutral-600 border-b">
            <Image src={Logo} height={32} width={32} alt="Logo" />
            <Link href="/" rel="back">
                <h1 className="font-extrabold md:text-3xl text-2xl cursor-pointer">
                    EarthGuesser
                </h1>
            </Link>
            <div className="flex relative items-center">
                <Link href="/leaderboard" title="Leaderboard" rel="next">
                    <span>
                    <Trophy className="absolute md:right-16 cursor-pointer
                    md:top-0 top-16 bg-neutral-900 z-30 rounded-full
                    -right-4 p-2 box-content md:box-border md:p-0 md:relative" />   
                    </span>
                </Link>
                {
                    session.status === "authenticated" ?
                    <div className="flex items-center gap-4">
                        <p className="underline cursor-pointer"
                        onClick={() => {signOut()}}>Log out</p> 
                        <Image src={session.data.user.image} height={32} 
                        width={32} alt="Avatar" 
                        className="rounded-full"/>
                    </div>
                    :
                    <p className="underline cursor-pointer"
                    onClick={() => {signIn()}}>Sign in</p> 
                }
            </div>
        </nav>
    )
}