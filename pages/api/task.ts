import { adminDB } from '@/config/firebaseAdmin'
import { FirebaseError } from 'firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        console.log('typeof of body', typeof req.body)
        console.log('body', req.body)
        console.log('cookies', req.cookies)
        console.log('query', req.query)

        if (req.cookies.token !== 'sunilpanwar1996@gmail.com') {
            return res.status(403).json({
                success: false,
                message: 'Permission denied',
            })
        }

        try {
            const data = JSON.parse(req.body)

            const { id } = await adminDB
                .collection('tasks')
                .add({ ...data, createdAt: Timestamp.now() })

            return res.status(200).json({ success: true, id })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: (error as FirebaseError).message,
            })
        }
    }

    return res.status(200).json({ message: 'Hello from Next.js!' })
}
