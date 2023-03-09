import NextLink from 'next/link'

function NotFound({ statusCode }: { statusCode: number }) {
    return (
        <div className="flex h-[85vh] items-center justify-center">
            <div className="space-y-5 text-center">
                <h1 className="font-semibold text-gray-800">
                    Project not found {statusCode}
                </h1>
                <NextLink
                    href="/app/today"
                    className="inline-block rounded bg-skin-main px-3 py-2 text-xsm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-main focus-visible:ring-offset-2"
                >
                    Back to Home view
                </NextLink>
            </div>
        </div>
    )
}
export default NotFound
