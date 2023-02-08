import { format } from 'date-fns'
import DropIcon from 'public/assets/drop.svg'
import EditIcon from 'public/assets/edit.svg'
import ThreeDotIcon from 'public/assets/three-dot.svg'

function TaskListItem({ title, dueDate, description }: Props) {
    console.log('dueDate', dueDate)

    return (
        <li
            className="group relative -mx-3 flex gap-x-2 rounded-md border  border-x-transparent border-y-gray-200 py-2 px-3 outline-none focus-within:border-blue-300 focus:border-blue-300"
            tabIndex={0}
        >
            <span
                className="absolute left-0 top-0 bottom-auto hidden -translate-x-[3ch] translate-y-1 transform align-top group-hover:inline-block"
                aria-label="drag and drop"
            >
                <DropIcon aria-hidden />
            </span>
            <div className="flex items-start justify-center">
                <input
                    type="checkbox"
                    className="inline-block h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-800 checked:bg-red-500"
                />
            </div>
            <div className="basis-full">
                <div className="flex justify-between">
                    <h3 className="text-sm">{title}</h3>
                    <div className="invisible inline-flex gap-x-2 group-focus-within:visible group-hover:visible">
                        <button
                            className="h-6 w-6 outline-none focus-visible:ring-1 focus-visible:ring-black"
                            aria-label="edit"
                        >
                            <EditIcon aria-hidden />
                        </button>
                        <button
                            className="h-6 w-6 outline-none focus-visible:ring-1 focus-visible:ring-black"
                            aria-label="more"
                        >
                            <ThreeDotIcon aria-hidden />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between text-xs">
                    <span className="text-skin-main">
                        {dueDate &&
                            format(new Date(dueDate._seconds! * 1000), 'EEE d')}
                    </span>
                    <span className="text-gray-500">{description}</span>
                </div>
            </div>
        </li>
    )
}

interface Props {
    title: string
    description: string
    dueDate: Date
}

export default TaskListItem
