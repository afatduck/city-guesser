import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"

import Logo from "../../public/favicon-32x32.png"
import { Trophy } from "tabler-icons-react"

import styles from "../../styles/component-styles/nav.module.css"
import { formatImageURL } from "../../utils/misc"

export default function Nav() {

    const session = useSession();    
    let userImage = formatImageURL(session?.data?.user?.image || "");

    return (
        <nav className={styles.nav}>

            <Image src={Logo} height={32} width={32} alt="Logo" />

            <Link href="/" rel="back">
                <h1>
                    <span>Earth</span>Guesser
                </h1>
            </Link>

            <div>
                <Link href="/leaderboard" title="Leaderboard" rel="next">
                    <span>
                        <Trophy />   
                    </span>
                </Link>
                {
                    session.status === "authenticated" ?
                    <div>

                        <p onClick={() => {signOut()}}>
                            Log out
                        </p> 

                        <Link href="/profile" title="Profile" rel="next">
                            <a className="h-8">
                                <Image 
                                src={userImage || ""} height={32} 
                                width={32} alt="Avatar" 
                                className="rounded-full"/>
                            </a>
                        </Link>

                    </div>
                    :
                    <Link href="/auth/signin" title="Sign in" rel="next">
                        <a>Sign in</a>
                    </Link>
                }
            </div>
        </nav>
    )
}