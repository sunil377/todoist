import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { MdEdit } from 'react-icons/md'

function EditButton({ project }: { project: string }) {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    className={clsx('flex items-center gap-x-2.5 px-3 py-2', {
                        'bg-gray-200/75': active,
                    })}
                >
                    <MdEdit className="text-lg" />
                    <span>Edit project</span>
                </button>
            )}
        </Menu.Item>
    )
}

export default EditButton
