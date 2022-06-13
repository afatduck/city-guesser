import LE from "../locationEncryption";
import client from "./client";

export const setLocation = async (key: string, location: string) => {

    const prev = await client.get("LOCATION_" + key);
    if (prev != 'open') {
        throw new Error("You cannot use this key!");
    }

    await client.set("LOCATION_" + key, location, {
        EX: 60 * 60
    });

}

export const getLocation = async (key: string): Promise<[number, number]> => {

    const encryptedLocation = await client.get("LOCATION_" + key);
    if (!encryptedLocation) {
        throw new Error("No location found!");
    }

    client.DEL("LOCATION_" + key);
    
    return LE.decryptLocation(encryptedLocation);
    
}