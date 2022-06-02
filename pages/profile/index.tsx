import { GetServerSidePropsContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";

import styles from "../../styles/page-styles/profile.module.css";
import ProfilePageImage from "../../components/client/profile/image";
import { useCallback, useEffect, useState } from "react";
import { UserData } from "../../@types/next-auth";
import { Loader } from "../../components/reusable/loader";
import { shortenNumber, formatImageURL } from "../../utils/misc";
import ChangeableField from "../../components/client/profile/field";
import { validateEmail, validateNameError, validateUsernameError } from "../../utils/validate";
import Link from "next/link";

export default function Profile() {

    const session = useSession();

    const [user, setUser] = useState({} as UserData);
    const [sentVerification, setSentVerification] = useState(false);
    const updateImage = useCallback((image: string) => {
        setUser(prev => ({...prev, image}));
    }, []);

    useEffect(() => {
        if (session.status === "authenticated") setUser(session.data.user);
    }, [session]);

    useEffect(() => {
        if (sentVerification) fetch("/api/auth/send-verification");
    }, [sentVerification])

    const submitChange = useCallback(async (name: keyof typeof user, value: string) => {
        let error = "";
        const changed:any = {};
        changed[name] = value;
        await fetch(`/api/change/${name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(changed)
        }).then(async res => {
            if (res.status === 200) {
                setUser(prev => ({...prev, ...changed}));
            } else {
                error = (await res.json()).message;
            }
        }).catch(() => {error = "An error occurred"});
        return error;
    }, []);

    const submitUsername = useCallback(async (username: string) => {
        return submitChange("username", username);
    }, []);

    const submitName = useCallback(async (name: string) => {
        return await submitChange("name", name);
    }, []);

    const submitEmail = useCallback(async (email: string) => {
        return await submitChange("email", email);
    }, []);

    if (session.status === "loading" || user.image === undefined) return <>
        <Head>
            <title>Profile | EarthGuesser</title>
        </Head>
        <div className="flex justify-center items-center grow">
            <Loader className="!text-green-600 !w-8 !h-8" />
        </div>
    </>;
    
    const imageURL = formatImageURL(user.image);

    return <>
        <Head>
            <title>Profile | EarthGuesser</title>
        </Head>
        <div className="middle-box">
            <div className={styles.body}>
                <ProfilePageImage image={imageURL} owned={true} 
                updateImage={updateImage} />
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
                    <ChangeableField className="text-2xl font-bold"
                    label="Username" value={user.username || ""}
                    validate={validateUsernameError} submit={submitUsername} />
                    <p className="text-xs opacity-50 italic">#{user.id}</p>
                    <hr />
                    <ChangeableField label="Name" value={user.name || ""}
                    validate={validateNameError} submit={submitName} />
                    {
                        user.credentialsProvider && 
                        <>
                        <ChangeableField label="Email" value={user.email || ""}
                        validate={email => validateEmail(email) ? "" : "Email invalid"}
                        submit={submitEmail} />
                        <div className="my-4 text-sm text-neutral-400 py-3 px-4 rounded-md bg-neutral-900">
                            {
                                user.emailVerified ?
                                <p className="text-green-500">Your email is verified.</p> :
                                sentVerification ? 
                                    <p>A verification email has been sent to your email.</p> :
                                    <p>Your email is not verified. Check your inbox or 
                                        click <span className="text-green-500 cursor-pointer"
                                        onClick={() => {setSentVerification(true)}}>here</span> to 
                                        get a new verification email.</p>
                            }
                            <p className="mt-2">
                                You can reset your password by going <Link href="/auth/reset"><a className="text-green-600">here</a></Link>.
                            </p>
                        </div>
                        </>
                    }
                    {JSON.stringify(user) !== JSON.stringify(session?.data?.user) &&
                    <p className="mt-auto text-sm">
                        <a className="text-green-600 cursor-pointer" 
                        onClick={() =>{window.location.reload()}}>
                        Refresh</a> to see your changes.
                    </p>
                    }
                </div>
            </div>
        </div>
    </>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {

    const session = await getSession(context);
    if (!session || !session.user) {
        context.res.writeHead(302, { Location: "/auth/signin" });
        context.res.end();
    }

    return { props: {} }

}
