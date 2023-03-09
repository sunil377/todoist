import { useRouter } from 'next/router'
import { useCallback, useRef } from 'react'
import { useKeypadListener } from './useKeypadListener'

function useGoToListener() {
    const storeKeyRef = useRef<Array<string>>([])
    const router = useRouter()

    const onkeydown = useCallback(
        function onkeydown(e: KeyboardEvent) {
            if (document.activeElement?.nodeName === 'INPUT') {
                return
            }
            switch (e.key) {
                case 'g':
                case 'u':
                case 't':
                case 'i':
                case 'h':
                    if (storeKeyRef.current.length === 2) {
                        storeKeyRef.current.shift()
                        storeKeyRef.current.push(e.key)
                    } else {
                        storeKeyRef.current.push(e.key)
                    }
                    break
                default:
                    storeKeyRef.current = []
            }

            switch (storeKeyRef.current.join(',')) {
                case 'g,t':
                    router.push('/app/today')
                    break
                case 'g,u':
                    router.push('/app/upcoming')
                    break
                case 'g,i':
                    router.push('/app/project/inbox')
                    break
                case 'g,h':
                    router.push('/app/today')
                    break

                default:
                    null
            }
        },
        [router],
    )

    useKeypadListener(onkeydown)
}

export default useGoToListener
