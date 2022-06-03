import { NextApiRequest, NextApiResponse } from "next";
import { validateEmail } from "../../../utils/validate";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

import prisma from "../../../utils/prisma";
import client from "../../../utils/redis/client";
import updateUpdatedAt from "../../../utils/redis/updated-at";

export default async function changeEmail(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method !== 'POST') {
        res.status(405).json({
            status: 405,
            message: 'Method not allowed'
        });
        return;
    }
    const { email } = req.body;
    if (!email) {
        res.status(400).json({
            status: 400,
            message: 'Email is required'
        });
        return;
    }
    if (!validateEmail(email)) {
        res.status(400).json({
            status: 400,
            message: 'Email is invalid'
        });
        return;
    }
    const session = await getSession({ req });
    if (!session || !session.user) {
        res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        });
        return;
    }
    if (await client.SISMEMBER('TAKEN_EMAILS', email)) {
        res.status(400).json({
            status: 400,
            message: 'Email is already taken'
        });
        return;
    }
    const prevEmail = (await prisma.user.findFirst({
        where: {
            id: session.user.id
        },
        select: {
            email: true
        }
    }))?.email;
    await prisma.user.update({
        where: { id: (session as Session).user.id },
        data: { email }
    }).then(() => {
        res.status(200).json({
            status: 200,
            message: 'Success'
        });
        client.SADD('TAKEN_EMAILS', email);
        if (prevEmail) return client.SREM('TAKEN_EMAILS', prevEmail);
        updateUpdatedAt(session.user.id);
    }).catch(() => {
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    });
}