import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { HiPencil } from 'react-icons/hi'

function EditButton({ onEdit }: { onEdit: () => void }) {
    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    className={clsx(
                        'flex w-full gap-x-2  py-1 px-3 text-start text-sm',
                        {
                            'bg-gray-100': active,
                        },
                    )}
                    onClick={onEdit}
                >
                    <HiPencil className="text-xl" />
                    <span>Edit</span>
                </button>
            )}
        </Menu.Item>
    )
}
export default EditButton
