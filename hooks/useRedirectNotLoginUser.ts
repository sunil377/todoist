import { useAuth } from 'context/AuthContext'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function useRedirectNotLoginUser() {
    const currentUser = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!currentUser) {
            router.replace('/auth/login')
        }
    }, [currentUser, router])
}

export default useRedirectNotLoginUser
