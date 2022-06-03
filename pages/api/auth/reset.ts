import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "next-auth/jwt";
import { hashPassword } from "../../../utils/passwords";

import prisma from "../../../utils/prisma";
import { validatePassword } from "../../../utils/validate";

export default async function reset(req: NextApiRequest, res: NextApiResponse) {

    const { password, token } = req.body;

    if (!password || !token) {
        return res.status(400).json({
            error: "Password and token are required"
        });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long and contain a number"
        });
    }

    const realToken = Buffer.from(token, "base64").toString("ascii");
    const decoded = await decode({
        secret: process.env.SECRET as string,
        token: realToken
    }).catch(() => {});

    if (!decoded || !decoded.userId || !(typeof decoded.userId === "string")) {
        return res.status(400).json({
            error: "Invalid token"
        });
    }

    prisma.user.update({
        where: {
            id: decoded.userId
        },
        data: {
            password: hashPassword(password)
        }
    })
    .then(() => {
        return res.status(200).json({
            success: true
        });
    })
    .catch(() => {
        return res.status(400).json({
            error: "Invalid token"
        });
    })

}