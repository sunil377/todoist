import { FallbackProps } from 'react-error-boundary'

function ErrorFallback({ error }: FallbackProps) {
    return <pre className="text-red-500">{error.message}</pre>
}

export default ErrorFallback
