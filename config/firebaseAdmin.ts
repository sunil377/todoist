import { cert, getApp, initializeApp, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

import secratekey from 'todo-app-fdbf6-firebase-adminsdk-dvncb-a28815fa28.json'

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

export { adminDB }
