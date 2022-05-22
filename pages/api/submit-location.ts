import { NextApiRequest, NextApiResponse } from "next";
import { getDistance, getPoints } from "../../utils/distance";
import { getLocation } from "../../utils/redis/getSetLocation";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";

// Welcome to the ugliest file in the entire project!!!

const prisma = new PrismaClient();

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
                        const { total_score, best_score } = await prisma.user.findFirst({
                            where: { id: userId },
                            select: { total_score: true, best_score: true }
                        }) || { total_score: 0, best_score: 0 }
                        const newTotalScore = total_score + points
                        const newBestScore = Math.max(points, best_score)
                        await prisma.user.update({
                            where: { id: userId },
                            data: { total_score: newTotalScore, best_score: newBestScore }
                        })
                    }
                }
            })
        }
    }
    
}