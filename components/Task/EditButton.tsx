import { Menu } from '@headlessui/react'
import clsx from 'clsx'

function EditButton({ ...props }) {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    className={clsx('w-full py-1 px-3 text-start text-sm', {
                        'bg-gray-100': active,
                    })}
                >
                    Edit
                </button>
            )}
        </Menu.Item>
    )
}
export default EditButton
