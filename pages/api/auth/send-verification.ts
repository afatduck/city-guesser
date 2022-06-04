import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { userInfo } from "os";
import sendMail from "../../../utils/mail/send";
import { verificationMailHTML } from "../../../utils/mail/verification";

export default async function sendVerification(req: NextApiRequest, res: NextApiResponse) {

    const session = await getSession({ req });
    if (!session || !session.user.id) {
        return res.status(401).json({
            error: "UNAUTHORIZED",
        });
    }
    const user = session.user;

    const jwt = await encode({
        secret: process.env.SECRET as string,
        maxAge: 7 * 24 * 60 * 60,
        token: {
            userId: user.id,
        } as any,
    });

    const base64JWT = Buffer.from(jwt).toString("base64");
    const url = `${process.env.NEXTAUTH_URL}/auth/verify/${base64JWT}`;

    const HTMLContent = verificationMailHTML({
        name: user.username || user.name || "guesser",
        url,
        firstTime: false,
    })

    sendMail({
        to: user.email as string,
        subject: "EarthGuesser Email Verification",
        html: HTMLContent,
    });

    res.status(200).json({
        success: true,
    });

}