import { useAuth } from 'context/AuthContext'
import { useRouter } from 'next/router'

function useRedirectNotLoginUser() {
    const currentUser = useAuth()
    const router = useRouter()

    if (!currentUser) {
        router.replace('/auth/login')
    }
}

export default useRedirectNotLoginUser
