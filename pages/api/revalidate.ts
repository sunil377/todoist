import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.query.token !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
        return res
            .status(401)
            .json({ type: 'failed', message: 'Invalid Token' })
    }

    try {
        await res.revalidate(req.query.path! as string)

        return res.status(200).json({ type: 'success', message: 'revalidate' })
    } catch (error) {
        return res
            .status(500)
            .json({ type: 'failed', message: 'unknown Error' })
    }
}
