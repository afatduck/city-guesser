import { NextApiRequest, NextApiResponse } from "next";
import { validateEmail, validatePassword, validateUsername } from "../../../utils/validate";

import prisma from "../../../utils/prisma";
import client from "../../../utils/redis/client";
import { hashPassword } from "../../../utils/passwords";
import { encode } from "next-auth/jwt";
import sendMail from "../../../utils/mail/send";
import { verificationMailHTML } from "../../../utils/mail/verification";

export default async function signUp(req: NextApiRequest, res: NextApiResponse) {

    const { username, email, password } = req.body;
    if (!validateUsername(username)) {
        res.status(400).json({
            error: "IU",
        });
        return;
    }

    if (!validateEmail(email)) {
        res.status(400).json({
            error: "IE",
        });
        return;
    }

    if (!validatePassword(password)) {
        res.status(400).json({
            error: "IP",
        });
        return;
    }

    const takenUsernames = await client.sMembers("TAKEN_USERNAMES");
    if (takenUsernames.includes(username)) {
        res.status(400).json({
            error: "TU",
        });
        return;
    }

    const takenEmails = await client.sMembers("TAKEN_EMAILS");
    if (takenEmails.includes(email)) {
        res.status(400).json({
            error: "TE",
        });
        return;
    }

    await prisma.user.create({
        data: {
            username: username,
            email: email,
            password: hashPassword(password),
        },
    })
    .then(async user => {
        res.status(200).json({
            success: true,
        });
        client.sAdd("TAKEN_USERNAMES", username);
        client.sAdd("TAKEN_EMAILS", email);

        const jwt = await encode({
            secret: process.env.SECRET as string,
            maxAge: 7 * 24 * 60 * 60,
            token: {
                userId: user.id,
            } as any
        })
        const base64JWT = Buffer.from(jwt).toString("base64");
        const url = `${process.env.NEXTAUTH_URL}/auth/verify/${base64JWT}`;
        const htmlContent = verificationMailHTML({
            name: user.username || "guesser",
            url: url,
            firstTime: true,
        })
        sendMail({
            to: user.email || "",
            subject: "Welcome to EarthGuesser!",
            html: htmlContent,
        });
    })
    .catch(error => {
        res.status(400).json({
            error: error.message,
        });
    })

}