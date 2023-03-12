import FullScreenLoader from '@/components/FullScreenLoader'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../config/firebase'

type ContextType = User | null

const AuthContext = createContext<ContextType>(null)

function useAuth() {
    const currentUser = useContext(AuthContext)
    return currentUser
}

const PROTECTED_ROUTES = ['/app/today', '/app/upcoming', '/app/project/[id]']
const PUBLIC_ROUTES = ['/auth/login', '/auth/signup']

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<ContextType>(null)
    const [isLoading, setLoading] = useState(true)
    const [isFinished, setFinished] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        async function main() {
            if (isFinished) {
                if (currentUser) {
                    const isPublicRoute = PUBLIC_ROUTES.includes(
                        router.pathname,
                    )
                    if (isPublicRoute) {
                        await router.replace('/app/today')
                    }
                    return
                }
                const isProtectedRoute = PROTECTED_ROUTES.includes(
                    router.pathname,
                )
                if (isProtectedRoute) {
                    await router.replace('/auth/login')
                }
            }
        }
        main().then(() => {
            if (isLoading && isFinished) {
                setLoading(false)
            }
        })
    }, [currentUser, isFinished, isLoading, router, router.pathname])

    useEffect(() => {
        return onAuthStateChanged(
            auth,
            async (user) => {
                let token = ''
                if (user) {
                    try {
                        token = await user.getIdToken()
                    } catch (error) {
                        token = ''
                    }
                }
                nookies.set(null, 'token', token, { path: '/' })
                setCurrentUser(user)
                setFinished(true)
                setError('')
            },
            (error) => {
                setError(error.message)
                setFinished(true)
                nookies.destroy(null, 'token')
            },
        )
    }, [])

    return (
        <AuthContext.Provider value={currentUser}>
            {isLoading ? <FullScreenLoader /> : children}
            {error && (
                <div
                    className="fixed bottom-5 left-1/2 z-alert mx-auto -translate-x-1/2 rounded-sm bg-red-500 px-5 py-1 text-center text-xsm font-semibold capitalize text-white"
                    role="alert"
                >
                    {error}
                </div>
            )}
        </AuthContext.Provider>
    )
}

export { useAuth, AuthProvider as default }
