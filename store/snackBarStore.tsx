import { createContext, useCallback, useContext, useRef } from 'react'

function useReturnStore() {
    const store = useRef(0)
    const subscription = useRef<Set<() => void>>(new Set())

    const getStore = useCallback(() => store.current, [])

    const setStore = useCallback((value: number) => {
        store.current = value
        subscription.current.forEach((fn) => fn())
    }, [])

    const subscribe = useCallback((fn: () => void) => {
        subscription.current.add(fn)
        return () => {
            subscription.current.delete(fn)
        }
    }, [])

    return {
        subscribe,
        getStore,
        setStore,
    }
}

const Context = createContext<ReturnType<typeof useReturnStore> | null>(null)

const useStoreContext = () => {
    const context = useContext(Context)
    if (!context) {
        throw new Error('useStoreContext is used outside its boundary')
    }
    return context
}

function SnackBarStoreProvider({ children }: { children: React.ReactNode }) {
    const store = useReturnStore()

    return <Context.Provider value={store}>{children}</Context.Provider>
}

export { SnackBarStoreProvider as default, useStoreContext }
