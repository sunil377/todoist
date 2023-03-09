import { useEffect } from 'react'

function useKeypadListener(fn: (e: KeyboardEvent) => void) {
    useEffect(() => {
        function onkeydown(e: KeyboardEvent) {
            if (document.activeElement?.nodeName !== 'INPUT') {
                fn(e)
            }
        }

        window.addEventListener('keydown', onkeydown)
        return () => {
            window.removeEventListener('keydown', onkeydown)
        }
    }, [fn])
}

export { useKeypadListener }
