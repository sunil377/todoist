import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { useDeleteTask } from 'hooks/services'
import { ITask } from 'index'
import { MdDeleteOutline } from 'react-icons/md'

function DeleteButton({ id: docId }: Pick<ITask, 'id'>) {
    const mutation = useDeleteTask()

    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    type="button"
                    className={clsx('flex items-center gap-x-2 text-start', {
                        'bg-gray-100 text-skin-main': active,
                    })}
                    onClick={() => {
                        mutation.mutate({
                            docId,
                        })
                    }}
                >
                    <MdDeleteOutline className="ml-2 text-xl" />

                    <span className="py-1 text-sm">Delate Task</span>
                    <span className="ml-auto mr-2 self-end py-1 text-xs text-gray-500">
                        Delete
                    </span>
                </button>
            )}
        </Menu.Item>
    )
}
export default DeleteButton
