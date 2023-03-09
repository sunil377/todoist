import { FirebaseErrorFallback } from '@/components/ErrorBoundary'
import { auth } from 'config/firebase'
import { FirebaseError } from 'firebase-admin'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getDoc, setDoc } from 'firebase/firestore'
import { getProjectRef } from 'hooks/services'
import { IButton } from 'index'
import { useRouter } from 'next/router'
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary'
import { FcGoogle } from 'react-icons/fc'
import { useMutation } from 'react-query'

const GoogleProvider = new GoogleAuthProvider()

function GoogleAuth(props: Props) {
    const router = useRouter()

    const {
        children = 'Continue with Google',
        redirectTo = '/app/today',
        type = 'button',
        ...rest
    } = props

    const { mutate, error, isLoading } = useMutation(
        async () => {
            const { user } = await signInWithPopup(auth, GoogleProvider)
            const response = await getDoc(getProjectRef(user.uid, 'inbox'))
            if (!response.exists()) {
                await setDoc(getProjectRef(user.uid, 'inbox'), {
                    title: 'inbox',
                })
            }
        },
        {
            onSuccess: () => router.push(redirectTo),
            onError: (err) => {
                alert((err as FirebaseError).message)
            },
        },
    )

    useErrorHandler(error)

    return (
        <button
            type={type}
            onClick={() => mutate()}
            {...rest}
            disabled={isLoading || false}
        >
            <FcGoogle className="text-2xl" />
            {children}
        </button>
    )
}

interface Props
    extends Omit<IButton, keyof Pick<IButton, 'onClick' | 'disabled'>> {
    redirectTo?: string
}

export default withErrorBoundary(GoogleAuth, {
    FallbackComponent: FirebaseErrorFallback,
})
