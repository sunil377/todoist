import { useKeypadListener } from 'hooks/useKeypadListener'
import { useCallback, useRef } from 'react'

function useProfileListener() {
    const keyPad = useRef<Array<'o' | 'u'>>([])
    const menuButtonRef = useRef<null | HTMLButtonElement>(null)

    const onkeydown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'o' || e.key === 'u') {
            if (keyPad.current.length === 2) {
                keyPad.current.shift()
            }
            keyPad.current.push(e.key)

            if (keyPad.current.at(0) === 'o' && keyPad.current.at(1) === 'u') {
                menuButtonRef.current?.click()
            }
        } else {
            keyPad.current = []
        }
    }, [])

    useKeypadListener(onkeydown)

    return menuButtonRef
}

export { useProfileListener }
