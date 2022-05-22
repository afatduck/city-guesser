// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { setLocation } from '../../utils/redis/getSetLocation';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(406)
  if (req.method === 'POST') {
    const key = req.body['key'];
    const location = req.body['location'];
        
    if (typeof key == 'string' && typeof location == 'string') {
      setLocation(key, location)
        .then(() => res.status(200).end())
        .catch(e => res.status(406).end(e.message));
    }
  }
}
