import { App, cert, getApp, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let app: App

try {
    app = getApp('default')
} catch (error) {
    app = initializeApp(
        {
            credential: cert({
                clientEmail: process.env.client_email,
                privateKey: process.env.private_key,
                projectId: process.env.project_id,
            }),
        },
        'default',
    )
}

const adminDB = getFirestore(app)
const adminAuth = getAuth(app)

export { adminDB, adminAuth }
