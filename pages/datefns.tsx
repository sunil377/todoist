import { startOfDay } from 'date-fns'
import { useEffect, useState } from 'react'

function Datefns({ ...props }) {
    const today = startOfDay(new Date())
    const [counter, setCounter] = useState(0)

    useEffect(() => {
        console.log('hello', today)
    }, [today])

    return (
        <div className="flex flex-col p-10">
            <button
                onClick={() => {
                    setCounter((prev) => prev + 1)
                }}
            >
                click
            </button>
            <div>{'counter :' + counter}</div>
            <div> {'today: ' + today}</div>
        </div>
    )
}

export default Datefns
