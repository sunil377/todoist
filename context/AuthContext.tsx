import FullScreenLoader from '@/components/FullScreenLoader'
import { onAuthStateChanged, User } from 'firebase/auth'
import nookies from 'nookies'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../config/firebase'

type ContextType = User | null

const AuthContext = createContext<ContextType>(null)

function useAuth() {
    const currentUser = useContext(AuthContext)
    return currentUser
}

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<ContextType>(null)
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        return onAuthStateChanged(
            auth,
            async (user) => {
                setCurrentUser(user)
                setLoading(false)
                let token = ''
                try {
                    token = (await user?.getIdToken()) ?? ''
                } catch (error) {
                    token = ''
                }
                nookies.set(null, 'token', token, { path: '/' })
            },
            (error) => {
                setError(error.message)
                nookies.set(null, 'token', '', { path: '/' })
            },
        )
    }, [])

    return (
        <AuthContext.Provider value={currentUser}>
            <div>{error}</div>
            {isLoading ? <FullScreenLoader /> : children}
        </AuthContext.Provider>
    )
}

export { useAuth, AuthProvider as default }
