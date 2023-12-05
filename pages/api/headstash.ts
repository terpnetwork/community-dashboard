// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { headstashData, HeadstashData} from '../../lib/headstash/headstashData'


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HeadstashData[]>
) {
  res.status(200).json(headstashData)
}
