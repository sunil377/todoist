function FullScreenLoader() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-skin-main/10">
            <Spinner />
        </div>
    )
}

function Spinner() {
    return (
        <div>
            <span className="sr-only">Loading</span>
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-r-0 border-skin-main" />
        </div>
    )
}

export { FullScreenLoader as default, Spinner }
