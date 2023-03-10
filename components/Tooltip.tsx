import clsx from 'clsx'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

function ToolTip({ className, ...props }: Props) {
    return (
        <div
            className={clsx(
                'tooltip-text absolute isolate z-10 hidden whitespace-nowrap rounded bg-black px-3 py-2 text-xs capitalize tracking-wide text-white after:absolute after:-z-10 after:h-3 after:w-3 after:rotate-45 after:bg-inherit sm:block',
                className,
            )}
            {...props}
        />
    )
}

interface Props
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export default ToolTip
