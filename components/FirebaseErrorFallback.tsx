import { auth } from 'config/firebase'
import { FirebaseError } from 'firebase/app'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { FallbackProps } from 'react-error-boundary'

function FirebaseErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    const [displayError, setDisplayError] = useState(error.message)
    const [method, setMethod] = useState<string | null>(null)

    useEffect(() => {
        async function main() {
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/account-exists-with-different-credential') {
                    const email = error.customData!.email as string
                    try {
                        const [provider] = await fetchSignInMethodsForEmail(auth, email)
                        setMethod(provider)
                    } catch (error: unknown) {
                        error instanceof FirebaseError && setDisplayError(error.code)
                        return
                    }
                }
            }
        }

        main()
    }, [error])

    return (
        <div className="text-center text-sm capitalize text-red-500" role="alert">
            {method ? (
                <p>
                    you are signup as {method}.
                    <button className="font-normal text-blue-500" onClick={resetErrorBoundary}>
                        Try again
                    </button>{' '}
                    with {method}
                </p>
            ) : (
                <p>{displayError}</p>
            )}
        </div>
    )
}

export default FirebaseErrorFallback
