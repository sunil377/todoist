import { ErrorFallback } from '@/components/ErrorBoundary'
import AuthProvider from 'context/AuthContext'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from 'react-query'
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
                <link rel="icon" href="/assets/todo.svg" />
                <link rel="manifest" href="/manifest.webmanifest" />
                <meta name="theme-color" content="#C24F3D" />
            </Head>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <QueryClientProvider client={client}>
                    <AuthProvider>
                        {getLayout(<Component {...pageProps} />)}
                    </AuthProvider>
                </QueryClientProvider>
            </ErrorBoundary>
        </>
    )
}
