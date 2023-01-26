import FirebaseErrorFallback from 'components/FirebaseErrorFallback'
import { auth } from 'config/firebase'
import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
import { IButton } from 'index'
import { useRouter } from 'next/router'
import { forwardRef } from 'react'
import { useErrorHandler, withErrorBoundary } from 'react-error-boundary'
import { RiFacebookCircleFill } from 'react-icons/ri'
import { useMutation } from 'react-query'

const FacebookProvider = new FacebookAuthProvider()

const FacebookAuth = forwardRef<HTMLButtonElement, Props>(function FacebookAuth(props, ref) {
    const router = useRouter()

    const { children = 'Continue with Facebook', redirectTo = '/app/today', type = 'button', ...rest } = props

    const { mutate, error, isLoading } = useMutation(() => signInWithPopup(auth, FacebookProvider), {
        onSuccess: () => router.push(redirectTo),
    })

    useErrorHandler(error)

    return (
        <button type={type} ref={ref} onClick={() => mutate()} disabled={isLoading} {...rest}>
            <RiFacebookCircleFill className="fill-blue-500" />
            {children}
        </button>
    )
})

interface Props extends Omit<IButton, keyof Pick<IButton, 'onClick' | 'disabled'>> {
    redirectTo?: string
}

export default withErrorBoundary(FacebookAuth, {
    FallbackComponent: FirebaseErrorFallback,
})
