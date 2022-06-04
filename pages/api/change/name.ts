import { NextApiRequest, NextApiResponse } from "next";
import { validateNameError } from "../../../utils/validate";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

import prisma from "../../../utils/prisma";
import updateUpdatedAt from "../../../utils/redis/updated-at";

export default async function changeName(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    if (method !== 'POST') {
        return res.status(405).json({
            status: 405,
            message: 'Method not allowed'
        });
    }
    const name = req.body.name || "";
    const error = name && validateNameError(name);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: error
        });
    }
    const session = await getSession({ req });
    if (!session || !session.user) {
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        });
    }
    await prisma.user.update({
        where: { id: (session as Session).user.id },
        data: { name }
    }).then(() => {
        res.status(200).json({
            status: 200,
            message: 'Success'
        });
        updateUpdatedAt(session.user.id);
    }).catch(() => {
        res.status(500).json({
            status: 500,
            message: 'Internal server error'
        });
    });
}