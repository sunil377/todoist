import clsx from 'clsx'
import { useState } from 'react'

function Error({ children }: { children: React.ReactNode }) {
    const [isMouseOver, setMouseOver] = useState(false)

    return (
        <div
            role="alert"
            aria-live="polite"
            className={clsx(
                'flex origin-top transform items-center rounded bg-skin-main px-6 text-sm font-medium text-white transition-all duration-500',
                isMouseOver ? 'h-auto' : 'h-10',
            )}
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
        >
            <span className={clsx(!isMouseOver && 'truncate')}>{children}</span>
        </div>
    )
}
export { Error }
