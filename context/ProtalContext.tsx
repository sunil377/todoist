import Snackbar from '@/components/Snackbar'
import { createContext, useContext, useState } from 'react'
import { MdDone, MdError } from 'react-icons/md'

interface ICommon {
    id: string
    message: string
    onClose: () => void
}

interface ISuccess extends ICommon {
    type: 'success'
    onUndo: () => void
}
interface IFailed extends ICommon {
    type: 'failed'
    onTryAgain: () => void
}

function useReturnPortal() {
    return useState<Map<string, ISuccess | IFailed>>(new Map())
}

const Context = createContext<ReturnType<typeof useReturnPortal> | null>(null)

function usePortal() {
    const ctx = useContext(Context)
    if (!ctx) {
        throw new Error('usePortal context is used outside of its provider')
    }
    return ctx
}

function ProtalProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useReturnPortal()

    const handleClose = (id: string) => {
        const copyState = new Map(state)
        if (copyState.has(id)) {
            copyState.delete(id)
        }
        setState(copyState)
    }

    return (
        <Context.Provider value={[state, setState]}>
            {children}
            <div className="fixed bottom-5 left-5 z-snackbar flex flex-col gap-y-2">
                {state &&
                    Array.from(state.values()).map((task) => (
                        <Snackbar.Container type={task.type} key={task.id}>
                            <Snackbar.Message
                                message={task.message}
                                icon={task.type === 'success' ? <MdDone aria-label="success" /> : <MdError aria-label="error" />}
                            />
                            <div className="flex gap-x-2">
                                {task.type === 'success' ? (
                                    <Snackbar.Action onClick={task.onUndo}>Undo</Snackbar.Action>
                                ) : (
                                    <Snackbar.Action onClick={task.onTryAgain}>Try Again</Snackbar.Action>
                                )}
                                <Snackbar.CloseButton onClick={() => handleClose(task.id)} />
                            </div>
                        </Snackbar.Container>
                    ))}
            </div>
        </Context.Provider>
    )
}

export { ProtalProvider, usePortal }
