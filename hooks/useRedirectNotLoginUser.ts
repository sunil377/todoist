import { useAuth } from 'context/AuthContext'
import { useRouter } from 'next/router'

function useRedirectNotLoginUser() {
    const currentUser = useAuth()
    const router = useRouter()

    if (!currentUser) {
        router.replace('/auth/login')
    }
}

function useRedirectToHome() {
    const currentUser = useAuth()
    const router = useRouter()

    if (currentUser) {
        console.log('redirect')
        router.replace('/app/today')
    }
}

export default useRedirectNotLoginUser
export { useRedirectToHome }
