import { FirebaseErrorFallback } from '@/components/ErrorBoundary'
import { auth } from 'config/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
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
        () => signInWithPopup(auth, GoogleProvider),
        {
            onSuccess: () => router.push(redirectTo),
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
