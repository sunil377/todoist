import FirebaseErrorFallback from 'components/FirebaseErrorFallback'
import { auth } from 'config/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { IButton } from 'index'
import { useRouter } from 'next/router'
import { forwardRef } from 'react'
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary'
import { FcGoogle } from 'react-icons/fc'
import { useMutation } from 'react-query'

const GoogleProvider = new GoogleAuthProvider()

const GoogleAuth = forwardRef<HTMLButtonElement, Props>(function GoogleAuth(props, ref) {
    const router = useRouter()

    const { children = 'Continue with Google', redirectTo = '/app/today', type = 'button', ...rest } = props

    const { mutate, error, isLoading } = useMutation(() => signInWithPopup(auth, GoogleProvider), {
        onSuccess: () => router.push(redirectTo),
    })

    useErrorHandler(error)

    return (
        <button type={type} ref={ref} onClick={() => mutate()} {...rest} disabled={isLoading || false}>
            <FcGoogle />
            {children}
        </button>
    )
})

interface Props extends Omit<IButton, keyof Pick<IButton, 'onClick' | 'disabled'>> {
    redirectTo?: string
}

export default withErrorBoundary(GoogleAuth, {
    FallbackComponent: FirebaseErrorFallback,
})
