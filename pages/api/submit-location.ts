import { NextApiRequest, NextApiResponse } from "next";
import { getDistance, getPoints } from "../../utils/distance";
import { getLocation } from "../../utils/redis/getSetLocation";

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
            .then(target => {
                if (target) {
                    const distance = getDistance(
                        target[0], target[1], location[0], location[1]
                        )
                    const points = getPoints(distance)
                    console.log(distance, points);
                    res.status(200).end();
                }
            })
        }
    }
    
}