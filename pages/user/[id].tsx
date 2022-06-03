import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { formatImageURL, shortenNumber } from "../../utils/misc";
import prisma from "../../utils/prisma";

import styles from "../../styles/page-styles/profile.module.css";
import ProfilePageImage from "../../components/client/profile/image";

export default function User({user}: Props) {
    if (!user) return <>
        <Head>
            <title>User Not Found | EarthGuesser</title>
        </Head>
        <div className="middle-box">
            <div>
                <h2>User not found</h2>
                <p className="mt-4">The user you are looking for does not exist. 
                    Click <Link href="/">
                        <a className="text-green-600">here</a>
                    </Link> to go back to the homepage.
                </p>
            </div>
        </div>
    </>

    const imageURL = formatImageURL(user.image);

    return <>
        <Head>
            <title>{user.username || user.name} | EarthGuesser</title>
        </Head>
        <div className="middle-box">
            <div className={styles.body}>
                <ProfilePageImage image={imageURL} owned={false} />
                <div className={styles['profile-page-info']}>
                    <section>
                        <div>
                            <p>Total score</p>
                            <div>{shortenNumber(user.totalScore)}</div>
                        </div>
                        <div>
                            <p>Best play</p>
                            <div>{user.bestScore}</div>
                        </div>
                    </section>
                    <p className="text-2xl font-bold">
                        {
                            user.username ? user.username :
                            <span>no username</span>
                        }
                    </p>
                    <p className="text-xs opacity-50 italic">#{user.id}</p>
                    <hr />
                    <p>
                        {
                            user.name ? user.name :
                            <span>no name</span>
                        }
                    </p>
                </div>
            </div>
        </div>
    </>

}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const id = context.query.id;
    if (typeof id !== "string") {
        context.res.writeHead(302, {Location: "/"});
        context.res.end();
        return {props: {}};
    }
    const session = await getSession(context);
    if (id === session?.user?.id) {
        context.res.writeHead(302, {Location: "/profile"});
        context.res.end();
        return {props: {}};
    }
    const user = await prisma.user.findFirst({where: {id: id}, select:{
        id: true,
        username: true,
        name: true,
        image: true,
        bestScore: true,
        totalScore: true,
    }});
    return {props: {user}};
}

interface User {
    id: string;
    name: string | null;
    username: string | null;
    image: string;
    bestScore: number;
    totalScore: number;
}

interface Props {
    user: User | null;
}