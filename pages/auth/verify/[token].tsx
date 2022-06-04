import { GetServerSidePropsContext } from "next";
import { decode } from "next-auth/jwt";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import prisma from "../../../utils/prisma";
import updateUpdatedAt from "../../../utils/redis/updated-at";

export default function Verify({code}: Props) {

    const [send, setSend] = useState<SendStatus>("NONE");
    const session = useSession()

    const handleSend = () => {
        setSend("SENDING");
        fetch("/api/auth/send-verification")
        .then(res => { 
            if (res.status === 200) {
                setSend("SENT");
            } else {
                setSend("FAILED");
            }
        }).catch(err => { setSend("FAILED"); });
    }

    let sendOption = <></>
    if (session.status === "authenticated") {
        switch (send) {
            case "NONE":
                sendOption = <p className="mt-4">
                    Click <span onClick={handleSend} 
                    className="text-green-600 cursor-pointer underline">
                        here
                    </span> to send a new verification email.
                </p>
                break;
            case "SENDING":
                sendOption = <div className="mt-8 mx-auto rounded-full
                animate-ping bg-green-600 w-4 h-4" />
                break;
            case "FAILED":
                sendOption = <p className="mt-4">
                    Failed to send a new verification email, click <span 
                    onClick={handleSend} 
                    className="text-green-600 cursor-pointer underline">
                        here
                    </span> to try again.
                </p>
                break;
            case "SENT":
                sendOption = <p className="mt-4">
                    A new verification email has been sent to your email address!
                </p>
                break;
        }
    }

    return <>
    <Head>
        <title>Email Verification | EarthGuesser</title>
        <meta name="robots" content="noindex"/>
    </Head>
    <div className="middle-box">
        <div>
            <h2 className="mb-4">
                Verification {code==="OK" ? "successful!" : "unsuccessful"}
            </h2>
            {
                code==="OK" ?
                <>
                    <p>
                        Thank you for verifying your email address.
                    </p>
                    <p>
                        You can return to the 
                        <Link href="/"> 
                            <a className="text-green-600"> home page</a>
                        </Link>.
                    </p>
                </> :
                <>
                    <p>
                        The verification code you entered was invalid. It may have expired.
                    </p>
                    {sendOption}
                </>
            }
        </div>
    </div>
    </>
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{props: Props}> {

    let code : Code = "IT";
    const base64Token = context.params?.token;
    if (typeof base64Token === "string" && base64Token.length > 0) {
        const token = Buffer.from(base64Token, "base64").toString("ascii");
        await decode({
            secret: process.env.SECRET as string,
            token,
        })
        .then(async decoded => {
            const userId = decoded?.userId;
            if (!(typeof userId === "string")) return;
            await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    emailVerified: new Date(),
                },
            }).then(() => { code = "OK"; updateUpdatedAt(userId); })
            .catch((err) => { console.log(err);});
        }).catch(() => {});
    }

    return {
        props: {
            code,
        },
    }

}

interface Props {
    code: Code;
}

type Code = "IT" | "OK"
type SendStatus = "SENT" | "FAILED" | "NONE" | "SENDING"