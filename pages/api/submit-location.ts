import { NextApiRequest, NextApiResponse } from "next";
import { getDistance, getPoints } from "../../utils/distance";
import { getLocation } from "../../utils/redis/getSetLocation";
import { getSession } from "next-auth/react";

import prisma from "../../utils/prisma";
import { createLocationKey } from "../../utils/redis/createLocationKey";

import gamemodes from "../../gamemodes.json";
import updateUpdatedAt from "../../utils/redis/updated-at";

export default async function submitLocation(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.status(406)
    const gamemode = req.cookies['gamemode'];
    const multiplier = gamemode && gamemodes.find(gm => gm.code === gamemode)?.multiplier;
    if (req.method === "POST" && multiplier) {
        const key = req.body["key"]
        const location = req.body["location"]
        if (typeof key == "string" && Array.isArray(location) && location.length === 2) {
            await getLocation(`${gamemode}_${key}`)
            .then(async target => {
                if (target) {
                    const distance = getDistance(
                        target[0], target[1], location[0], location[1]
                        )
                    const points = getPoints(distance, multiplier)
                    res.status(200).json({
                        newKey: createLocationKey(gamemode)
                    });
                    if (!points) return
                    const session = await getSession({ req })
                    const userId = session?.user?.id
                    if (userId) {
                        const { totalScore, bestScore } = await prisma.user.findFirst({
                            where: { id: userId },
                            select: { totalScore: true, bestScore: true }
                        }) || { totalScore: 0, bestScore: 0 }
                        const newTotalScore = totalScore + points
                        const newBestScore = Math.max(points, bestScore)
                        await prisma.user.update({
                            where: { id: userId },
                            data: { totalScore: newTotalScore, bestScore: newBestScore }
                        })
                        updateUpdatedAt(userId)
                    }
                }
            })
            .catch(e => {res.status(406).end(e.message)})
        }
    }
    res.end()
}