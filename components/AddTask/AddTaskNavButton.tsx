import { Dialog } from '@headlessui/react'
import { useKeypadListener } from 'hooks/useKeypadListener'
import { Fragment, useCallback, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import ToolTip from '../Tooltip'

import { AddTaskComponent } from './AddTask'

function AddTaskNavButton() {
    const [isOpen, setOpen] = useState(false)

    const onkeydown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'q') {
            e.preventDefault()
            setOpen((prev) => !prev)
        }
    }, [])

    useKeypadListener(onkeydown)

    return (
        <Fragment>
            <button
                className="tooltip relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus-visible:bg-white/20"
                onClick={() => setOpen(true)}
            >
                <ToolTip className="top-full left-1/2 -translate-x-1/2 translate-y-2 after:-top-1 after:left-1/2 after:-translate-x-1/2">
                    Add Task <kbd>Q</kbd>
                </ToolTip>
                <MdAdd className="text-xl md:text-2xl" />
            </button>

            <Dialog
                onClose={setOpen}
                open={isOpen}
                className="fixed inset-x-0 top-1/4 isolate z-50 mx-auto w-10/12 max-w-md"
            >
                <div aria-hidden className="fixed inset-0 z-10 bg-black/20" />
                <Dialog.Panel className="relative z-20 rounded border bg-white p-5">
                    <Dialog.Title className="sr-only">Add task</Dialog.Title>
                    <AddTaskComponent
                        close={
                            <button
                                onClick={() => setOpen(false)}
                                type="button"
                                className="flex-shrink-0 rounded border-4 border-transparent py-1 px-2 text-sm text-gray-500 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                        }
                    />
                </Dialog.Panel>
            </Dialog>
        </Fragment>
    )
}
export default AddTaskNavButton
