import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import sizeOf from 'image-size';
import sharp from 'sharp';

import prisma from "../../../utils/prisma";
import updateUpdatedAt from "../../../utils/redis/updated-at";
import bucket from "../../../utils/bucket";

export default async function changeImage(req: NextApiRequest, res: NextApiResponse) {
    const { base64Image } = req.body;
    if (!base64Image) {
        return res.status(400).json({ message: "No image provided" });
    }
    const img = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const dimensions = sizeOf(img);
    if (typeof dimensions.width === 'undefined') {
        return res.status(400).json({ message: "Image data is not valid" });
    }
    
    if (dimensions.width < 128) {
        return res.status(400).json({ message: "Image is too small" });
    }
    if (dimensions.height !== dimensions.width) {
        return res.status(400).json({ message: "Image is not square" });
    }
    const session = await getSession({ req });
    if (!session || !session.user) {
        return res.status(401).json({ message: "Not logged in" });
    }

    const user = session.user;
    const fileName = `${user.id}-${Date.now()}.png`;
    let previousImage = (await prisma.user.findFirst({
        where: {
            id: user.id
        },
        select: {
            image: true
        }
    }))?.image;
    if (/^https?:\/\//.test(previousImage || '')) previousImage = "";

    await prisma.user.update({
        where: { id: user.id },
        data: { image: fileName }
    }).then(async() => {
        const resizedImage = await sharp(img).resize(512).toBuffer();
        await bucket.file(`avatars/${fileName}`).save(resizedImage);
        res.status(200).json({ message: "Image uploaded" });
        if (previousImage) bucket.file(`avatars/${previousImage}`).delete().catch(() => {});
        updateUpdatedAt(user.id);
    }).catch(err => {        
        res.status(500).json({ message: "Error uploading image" });
    });

}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "4mb"
        }
    }
}