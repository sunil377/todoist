import { onAuthStateChanged, User } from 'firebase/auth'
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

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setCurrentUser(user),
                (document.cookie = `token=${user?.email ?? null}; path=/`)
        })
    }, [])

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
export { useAuth }
