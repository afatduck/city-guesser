import client from "./client";
import prisma from "../prisma";

export default async function updateUpdatedAt(userId: string) {
    const user = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            updatedAt: true
        }
    });
    const updatedAt = user?.updatedAt;
    if (updatedAt) {
        await client.set(`UPDATED_AT_${userId}`, String(updatedAt));
    }
}