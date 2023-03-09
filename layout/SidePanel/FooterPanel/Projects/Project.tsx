import { Menu } from '@headlessui/react'
import { IProject } from 'index'
import NextLink from 'next/link'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import DeleteButton from './DeleteButton'
import EditButton from './EditButton'

function Project(arg: IProject) {
    const { title, id } = arg
    return (
        <Menu as="div" className="relative">
            <div className="flex w-full items-center justify-between p-0.5 hover:bg-gray-200/75">
                <NextLink
                    href={`/app/project/${id}`}
                    className="w-full rounded border border-transparent px-3 py-1.5 capitalize focus:outline-none focus-visible:border-blue-300 focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                    {title}
                </NextLink>
                <Menu.Button className="rounded border border-transparent p-1 focus:outline-none focus-visible:border-blue-300 focus-visible:ring-4 focus-visible:ring-blue-100">
                    <HiOutlineDotsHorizontal
                        className="text-xl"
                        aria-label="more actions"
                        title="More Action"
                    />
                </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 top-full z-10 flex w-60 flex-col rounded-sm border border-gray-200/75 bg-white py-1 text-gray-700 shadow-inner">
                <EditButton project={title} />
                <DeleteButton {...arg} />
            </Menu.Items>
        </Menu>
    )
}

export default Project
