import { Menu } from '@headlessui/react'
import { IProject } from 'index'
import NextLink from 'next/link'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { findColor } from '..'
import DeleteButton from './DeleteButton'

function Project(arg: IProject) {
    const { title, id, color } = arg
    return (
        <Menu as="div" className="relative">
            <div className="flex w-full items-center justify-between p-0.5 hover:bg-gray-200/75">
                <NextLink
                    href={`/app/project/${id}`}
                    className="flex w-full items-center gap-x-3 rounded border border-transparent px-3 py-1.5 capitalize focus:outline-none focus-visible:border-blue-300 focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                    <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{
                            background: findColor(color),
                        }}
                    ></span>

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
            <Menu.Items className="absolute z-10 flex w-[min(200px,100vw-2rem)] flex-col rounded border border-gray-300 bg-white py-1 text-sm text-gray-700 shadow-md shadow-gray-300 focus:outline-none focus-visible:border-gray-500">
                <DeleteButton {...arg} />
            </Menu.Items>
        </Menu>
    )
}

export default Project
