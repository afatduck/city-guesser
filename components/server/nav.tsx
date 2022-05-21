import Link from "next/link"
import Image from "next/image"

import Logo from "../../public/favicon.ico"

export default function Nav() {

    return (
        <nav className="flex px-8 py-4 justify-between items-center">
            <Image src={Logo} height={32} width={32} />
            <Link href="/">
                <h1 className="font-extrabold text-3xl">
                    EarthGuesser
                </h1>
            </Link>
            <p className="underline cursor-pointer">Log in</p> 
        </nav>
    )
}