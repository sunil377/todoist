import { cert, getApp, initializeApp, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

import secratekey from '../todo-app-fdbf6-firebase-adminsdk-dvncb-f0394389dd.json'

let app

try {
    app = getApp('default')
} catch (error) {
    app = initializeApp(
        {
            credential: cert(secratekey as ServiceAccount),
        },
        'default',
    )
}

const adminDB = getFirestore(app)
const adminAuth = getAuth(app)

export { adminDB, adminAuth }
