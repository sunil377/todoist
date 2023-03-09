import clsx from 'clsx'
import { IButton } from 'index'
import { useEffect, useRef } from 'react'
import { MdClose } from 'react-icons/md'

interface ICloseButton extends Omit<IButton, 'onClick'> {
    onClick: () => void
}

const Snackbar = {} as {
    Container: React.FC<Props>
    CloseButton: React.FC<ICloseButton>
    Message: React.FC<MessageProps>
    Action: React.FC<IButton>
}

Snackbar.Container = function Container({ children, type }: Props) {
    const ref = useRef<null | HTMLDivElement>(null)

    useEffect(() => ref.current?.focus(), [])

    return (
        <div
            role="alert"
            aria-live="assertive"
            className={`flex w-full max-w-xs items-center justify-between gap-x-2 rounded-md border border-transparent px-4 py-3 align-middle capitalize shadow-2xl outline-none focus:ring-2  focus:ring-offset-2 ${clsx(
                {
                    'bg-green-700 text-white ring-green-400':
                        type === 'success',
                },
                { 'bg-skin-main text-white ring-skin-main': type === 'failed' },
            )}`}
            tabIndex={0}
            ref={ref}
        >
            {children}
        </div>
    )
}

Snackbar.Message = function SnackbarMessage({ message, icon }: MessageProps) {
    return (
        <p className="flex max-w-[280px] items-center justify-start gap-x-2 truncate">
            <span className="inline-block text-xl">{icon}</span>
            <strong className="truncate text-sm font-medium tracking-wide">
                {message}
            </strong>
        </p>
    )
}

Snackbar.CloseButton = function SnackbarClose({
    onClick,
    ...rest
}: ICloseButton) {
    useEffect(() => {
        setTimeout(() => {
            onClick()
        }, 10000)
    }, [onClick])

    return (
        <button
            type="button"
            aria-label="close"
            {...rest}
            onClick={onClick}
            className="rounded-sm tracking-wide outline-none focus:ring-2 focus:ring-white"
        >
            <MdClose aria-hidden className="text-2xl" />
        </button>
    )
}

Snackbar.Action = function SnackbarAction(props: IButton) {
    return (
        <button
            type="button"
            className="min-w-max rounded-sm p-0.5 text-sm uppercase outline-none focus-visible:ring-2 focus-visible:ring-white"
            {...props}
        />
    )
}

interface Props {
    children: React.ReactNode
    type: 'success' | 'failed'
}

interface MessageProps {
    message: string
    icon: JSX.Element
}

export default Snackbar
