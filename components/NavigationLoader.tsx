import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function NavigationLoader() {
    const [isLoading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        function onLoadStart() {
            setLoading(true)
        }

        function onError() {
            setLoading(false)
        }

        function onLoad() {
            setLoading(false)
        }

        router.events.on('routeChangeStart', onLoadStart)
        router.events.on('routeChangeComplete', onLoad)
        router.events.on('routeChangeError', onError)

        return () => {
            router.events.off('routeChangeStart', onLoadStart)
            router.events.off('routeChangeComplete', onLoad)
            router.events.off('routeChangeError', onError)
        }
    }, [router.events])

    if (isLoading) {
        return (
            <div
                aria-label="page loading"
                role="alert"
                aria-live="polite"
                className="fixed inset-x-0 top-0 z-[11000] h-1 animate-pulse bg-blue-500"
            ></div>
        )
    }

    return null
}

export default NavigationLoader
