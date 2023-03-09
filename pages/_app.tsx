import { ErrorFallback } from '@/components/ErrorBoundary'
import AuthProvider from 'context/AuthContext'
import { ProtalProvider } from 'context/ProtalContext'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import SnackBarStoreProvider from 'store/snackBarStore'
import 'styles/globals.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const client = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => page)

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                {/* <link rel="icon" href="/assets/todo.svg" /> */}
                <link rel="manifest" href="/manifest.webmanifest" />
                <meta name="theme-color" content="#C24F3D" />
            </Head>

            <div>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <NavigationLoader />
                    <QueryClientProvider client={client}>
                        <AuthProvider>
                            <ProtalProvider>
                                <SnackBarStoreProvider>
                                    {getLayout(<Component {...pageProps} />)}
                                </SnackBarStoreProvider>
                            </ProtalProvider>
                        </AuthProvider>
                    </QueryClientProvider>
                </ErrorBoundary>
            </div>
        </>
    )
}

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
