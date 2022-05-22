import sha256 from 'crypto-js/sha256';
import client from './client';

const salt = process.env["LOCATION_KEY_SALT"];

// Creates a key under which the location will be stored in redis.
// First it just sets the key to 'open', then once client requests
// storing the location, it will be changed to encrypted location.

export const createLocationKey = (): string => {

    const key = sha256(salt + new Date().toString()).toString();

    client.set("LOCATION_" + key, 'open', {
        EX: 60
    });

    return key;

}