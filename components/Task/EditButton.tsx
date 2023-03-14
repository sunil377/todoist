import { Menu } from '@headlessui/react'
import clsx from 'clsx'

function EditButton({ onEdit }: { onEdit: () => void }) {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    className={clsx('w-full py-1 px-3 text-start text-sm', {
                        'bg-gray-100': active,
                    })}
                    onClick={onEdit}
                >
                    Edit
                </button>
            )}
        </Menu.Item>
    )
}
export default EditButton
