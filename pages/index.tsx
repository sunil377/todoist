import { signOut } from 'firebase/auth'
import Head from 'next/head'
import { auth } from '../config/firebase'
import { useAuth } from '../context/AuthContext'

export default function Home() {
    const currentUser = useAuth()

    return (
        <>
            <Head>
                <title>Log in to Todoist</title>
            </Head>
            <main className="py-4 px-8">
                <p>
                    {currentUser
                        ? `you are login ${currentUser.email}`
                        : 'unauthorized'}
                </p>
                <button onClick={logOut}>log out</button>
            </main>
        </>
    )
}

async function logOut() {
    try {
        await signOut(auth)
    } catch (error) {
        console.log(error)
    }
}
