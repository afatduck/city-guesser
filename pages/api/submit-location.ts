import { NextApiRequest, NextApiResponse } from "next";
import { getDistance, getPoints } from "../../utils/distance";
import { getLocation } from "../../utils/redis/getSetLocation";
import { getSession } from "next-auth/react";

import prisma from "../../utils/prisma";

// Welcome to the ugliest file in the entire project!!!

export default function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.status(406)
    if (req.method === "POST") {
        const key = req.body["key"]
        const location = req.body["location"]
        if (typeof key == "string" && Array.isArray(location) && location.length === 2) {
            getLocation(key)
            .catch(e => {res.status(406).end(e.message)})
            .then(async target => {
                if (target) {
                    const distance = getDistance(
                        target[0], target[1], location[0], location[1]
                        )
                    const points = getPoints(distance)
                    res.status(200).end();
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
                    }
                }
            })
        }
    }
    
}