import { Storage, Bucket } from '@google-cloud/storage';

let bucket: Bucket;

if (!global.bucket) {
    const storage = new Storage({
        projectId: 'buoyant-program-350915',
        credentials: {
            client_email: process.env.GOOGLE_CLOUD_STORAGE_EMAIL,
            private_key: process.env.GOOGLE_CLOUD_STORAGE_KEY?.replace(/\\n/g, '\n')
        },
        scopes: ['https://www.googleapis.com/auth/devstorage.read_write']
    });
    const bucket = storage.bucket("earthguesser-bucket")
    global.bucket = bucket;
}
bucket = global.bucket;

export default bucket;

declare global {
    var bucket: Bucket;
}