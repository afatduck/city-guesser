import NodeRSA from 'encrypt-rsa';

const nodeRsa = new NodeRSA();

/*
    This one is a bit of a mess. It went through a lot of changes and
    I'm just happy to have it working.
*/

class LocationEncryptor {

    private readonly public_key: string = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1rd5a2k4nTsMX7yM2yhC
    uqb0xbc0KS53sez4uAGolc1O1uXC8ThlgMduly+Y3YtcfpU3Zzq814lhIokPGR4+
    sYVi6UzT/dIiRMRSEeYSDJJtahmYaVnLqPdElQ7Hffh3mBhBA7pUs1W1fT0XpERo
    wsHajXUHelKI7hJGejhfG8FZfbgXFwAhC5A/Ue9UhbhZjHOQhHTI/AGsZ6cAdPL3
    FRQConfyR2u9W7M8PA6UkA/Ce9rwk2/MN31g1rneDyYUBrpjBJH4K12fmfTsCtAO
    isPG/lLtaQ23qaaa7P8EVSrfUJZw6UUzYY73eY+8s10B7/k3s31iUUtb7srCumR+
    NQIDAQAB
    -----END PUBLIC KEY-----`;

    private readonly private_key: string = (
        process.env["PRIVATE_KEY"] || ""
    ).replace(/\\n/g, "\n");

    constructor () {}

    encryptLocation (location: [number, number]): string {
        
        const jsonLocation = JSON.stringify(location);
        const encrypted = nodeRsa.encryptStringWithRsaPublicKey({
            text: jsonLocation,
            publicKey: this.public_key
        })

        return encrypted;
    }

    decryptLocation (encrypted: string): [number, number] {

        console.log(2, this.private_key);
        

        const decryptedJSON = nodeRsa.decryptStringWithRsaPrivateKey({
            text: encrypted,
            privateKey: this.private_key
        });
        console.log(decryptedJSON);
        

        const decrypted = JSON.parse(decryptedJSON);
        
        // Check the validity of the decrypted location
        if (!Array.isArray(decrypted) || decrypted.length !== 2 || typeof decrypted[0] !== "number" || typeof decrypted[1] !== "number") {
            throw new Error("Invalid location");
        }

        return decrypted as [number, number];
    }
}

export default new LocationEncryptor();