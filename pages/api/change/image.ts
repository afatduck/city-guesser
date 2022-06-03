import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import sizeOf from 'image-size';
import fs from 'fs';
import path from 'path';

import prisma from "../../../utils/prisma";
import updateUpdatedAt from "../../../utils/redis/updated-at";

export default async function changeImage(req: NextApiRequest, res: NextApiResponse) {
    const { base64Image } = req.body;
    if (!base64Image) {
        res.status(400).json({ message: "No image provided" });
        return;
    }
    const img = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const dimensions = sizeOf(img);
    if (typeof dimensions.width === 'undefined') {
        res.status(400).json({ message: "Image data is not valid" });
        return;
    }
    
    if (dimensions.width < 128) {
        res.status(400).json({ message: "Image is too small" });
        return;
    }
    if (dimensions.height !== dimensions.width) {
        res.status(400).json({ message: "Image is not square" });
        return;
    }
    const session = await getSession({ req });
    if (!session || !session.user) {
        res.status(401).json({ message: "Not logged in" });
        return;
    }

    const user = session.user;
    const fileName = `${user.id}-${Date.now()}.png`;
    const avatarPath = path.join("./", "public", "avatars");
    const previousImage = (await prisma.user.findFirst({
        where: {
            id: user.id
        },
        select: {
            image: true
        }
    }))?.image;
    

    await prisma.user.update({
        where: { id: user.id },
        data: { image: fileName }
    }).then(() => {
        fs.writeFileSync(path.join(avatarPath, fileName), img);
        res.status(200).json({ message: "Image uploaded" });

        if (previousImage && previousImage !== "default.png") {
            fs.unlinkSync(path.join(avatarPath, previousImage));
        }
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