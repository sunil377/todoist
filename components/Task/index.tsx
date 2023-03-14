import { Menu } from '@headlessui/react'
import { ITask } from 'index'
import DropIcon from 'public/assets/drop.svg'
import { useState } from 'react'
import { MdCreate, MdMoreHoriz } from 'react-icons/md'
import UpdateTask from '../AddTask/UpdateTask'
import Tooltip from '../Tooltip'
import CompletedCheckbox from './CompletedCheckbox'
import DateDisplay from './DateDisplay'
import DeleteButton from './DeleteButton'
import EditButton from './EditButton'

function Task(props: ITask) {
    const [stage, setStage] = useState<'display' | 'edit'>('display')

    function handleEdit() {
        setStage('edit')
    }

    if (stage === 'edit') {
        return <UpdateTask handleClose={() => setStage('display')} {...props} />
    }

    return (
        <>
            <li
                className="group relative -mx-3 flex items-start gap-x-2 rounded border border-transparent border-b-gray-200 py-1 px-3 focus-within:border-indigo-300 focus-within:bg-indigo-50 focus:border-indigo-300 focus:bg-indigo-50 focus:outline-none"
                tabIndex={0}
            >
                <div
                    className="absolute left-0 top-0.5 bottom-auto hidden -translate-x-[3ch] translate-y-1 transform cursor-move align-top group-hover:inline-block"
                    aria-label="drag and drop"
                >
                    <DropIcon aria-hidden />
                </div>
                <CompletedCheckbox id={props.id} />

                <div className="flex basis-full flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xsm">{props.title}</h3>
                        <div className="invisible inline-flex gap-x-2 group-focus-within:visible group-hover:visible">
                            <button
                                className="tooltip relative rounded-sm p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                                onClick={() => setStage('edit')}
                            >
                                <Tooltip className="bottom-full left-1/2 -translate-x-1/2 -translate-y-2 after:-bottom-1 after:left-1/2 after:-translate-x-1/2">
                                    Edit Task
                                </Tooltip>
                                <MdCreate
                                    aria-hidden
                                    className="text-xl text-gray-700"
                                />
                            </button>

                            <Menu as="div" className="relative">
                                <Menu.Button className="tooltip relative rounded-sm p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black">
                                    <Tooltip className="bottom-full left-1/2 -translate-x-1/2 -translate-y-2 after:-bottom-1 after:left-1/2 after:-translate-x-1/2">
                                        More Task Actions
                                    </Tooltip>
                                    <MdMoreHoriz
                                        aria-hidden
                                        className="text-xl text-gray-700"
                                    />
                                </Menu.Button>

                                <Menu.Items className="z-tooltip absolute right-0 flex w-56 flex-col rounded border border-gray-300 bg-white py-2 text-start text-gray-600 outline-none">
                                    <EditButton onEdit={handleEdit} />
                                    <DeleteButton id={props.id} />
                                </Menu.Items>
                            </Menu>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500">{props.description}</p>
                    <DateDisplay dueDate={props.dueDate} />
                </div>
            </li>
        </>
    )
}

export default Task
