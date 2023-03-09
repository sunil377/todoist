import { Disclosure } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'

function Page() {
    return (
        <div className="flex bg-red-500">
            <Disclosure>
                <Disclosure.Panel static className="bg-green-500">
                    {({ open }) => {
                        return (
                            <Fragment>
                                <div
                                    className={clsx(
                                        'fixed h-full w-56 bg-blue-500 transition-all duration-1000 sm:w-64',
                                        open ? 'left-0' : '-left-full',
                                    )}
                                >
                                    <button>hell</button>
                                </div>
                                <div
                                    className={clsx(
                                        'w-full bg-pink-500 p-10  transition-all duration-1000',
                                        open ? 'ml-56' : 'ml-0',
                                    )}
                                >
                                    <Disclosure.Button>
                                        button
                                    </Disclosure.Button>
                                </div>
                            </Fragment>
                        )
                    }}
                </Disclosure.Panel>
            </Disclosure>
        </div>
    )
}

export default Page
