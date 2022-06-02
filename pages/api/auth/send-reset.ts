import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "next-auth/jwt";
import { resetMailHTML } from "../../../utils/mail/reset";
import sendMail from "../../../utils/mail/send";

import prisma from "../../../utils/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { username } = req.body;
    if (!username) {
        res.status(400).json({ error: "No username provided" });
        return;
    }
    const user = await prisma.user.findFirst({
        select: {
            id: true,
            email: true,
            username: true,
            password: true,
            emailVerified: true,
            name: true,
        },
        where: {
            username: username,
        },
    });
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    if (!user.password) {
        res.status(400).json({ error: "You can't reset password of an account which uses thrid party authentication." });
        return;
    }
    if (!user.emailVerified) {
        res.status(400).json({ error: "User email not verified" });
        return;
    }
    const jwt = await encode({
        secret: process.env.SECRET as string,
        maxAge: 7 * 24 * 60 * 60,
        token: {
            userId: user.id,
        } as any
    })
    const base64JWT = Buffer.from(jwt).toString("base64");
    const url = `${process.env.NEXTAUTH_URL}/auth/reset/${base64JWT}`;
    const htmlContent = resetMailHTML({
        name: user.name || username,
        url: url,
    })
    sendMail({
        to: user.email as string,
        subject: "Password Reset",
        html: htmlContent,
    })
    res.status(200).json({ success: true });
}