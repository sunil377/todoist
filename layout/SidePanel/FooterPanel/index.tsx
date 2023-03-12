import { Dialog, Disclosure } from '@headlessui/react'
import clsx from 'clsx'
import { useState } from 'react'
import { HiChevronLeft, HiPlus } from 'react-icons/hi'
import AddProjectForm from './AddProjectForm'
import Projects from './Projects'

function FooterSidePanel() {
    const [isOpen, setOpen] = useState(false)

    return (
        <Disclosure as="div">
            <div className="flex items-center gap-x-1 rounded-sm pl-3 text-sm font-semibold text-gray-600 hover:bg-gray-200">
                <div>Projects</div>
                <button
                    type="button"
                    className="ml-auto rounded border border-transparent p-2 focus:outline-none focus-visible:border-blue-300 focus-visible:ring-4 focus-visible:ring-blue-100"
                    onClick={() => setOpen(true)}
                >
                    <HiPlus aria-label="Add Project" className="text-base" />
                </button>
                <Disclosure.Button className="rounded border border-transparent p-1.5 focus:outline-none focus-visible:border-blue-300 focus-visible:ring-4 focus-visible:ring-blue-100">
                    {({ open }) => {
                        const label = open
                            ? 'hide project list'
                            : 'close project list'

                        return (
                            <HiChevronLeft
                                aria-label={label}
                                className={clsx(
                                    'text-xl transition-transform duration-300',
                                    { '-rotate-90': open },
                                )}
                            />
                        )
                    }}
                </Disclosure.Button>
                <Dialog
                    onClose={setOpen}
                    open={isOpen}
                    className="fixed inset-x-0 top-1/4 z-50"
                >
                    <div className="fixed inset-0 bg-black/25" />

                    <Dialog.Panel className="relative mx-auto w-11/12 max-w-xs space-y-4 rounded-xl bg-white shadow-inner sm:w-10/12 sm:max-w-md">
                        <Dialog.Title className="px-8 pt-4 text-xl font-semibold">
                            Add Project
                        </Dialog.Title>

                        <AddProjectForm onClose={() => setOpen(false)} />
                    </Dialog.Panel>
                </Dialog>
            </div>

            <Disclosure.Panel as="ul" className="flex flex-col gap-y-1 text-sm">
                <Projects />
            </Disclosure.Panel>
        </Disclosure>
    )
}

export default FooterSidePanel
