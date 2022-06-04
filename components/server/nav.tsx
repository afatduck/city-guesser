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

            <Link href="/">
                <a><h1>
                    <span>Earth</span>Guesser
                </h1></a>
            </Link>

            <div>
                <Link href="/leaderboard" title="Leaderboard">
                    <a><span>
                        <Trophy />
                    </span></a>
                </Link>
                {
                    session.status === "authenticated" ?
                    <div>

                        <p onClick={() => {signOut()}}>
                            Log out
                        </p> 

                        <Link href="/profile" title="Profile" rel="nofollow">
                            <a className="h-8">
                                <Image 
                                src={userImage || ""} height={32} 
                                width={32} alt="Avatar" 
                                className="rounded-full"/>
                            </a>
                        </Link>

                    </div>
                    :
                    <Link href="/auth/signin" title="Sign in">
                        <a>Sign in</a>
                    </Link>
                }
            </div>
        </nav>
    )
}