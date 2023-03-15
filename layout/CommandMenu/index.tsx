import { default as ToolTip } from '@/components/Tooltip'
import { Combobox, Dialog, Menu, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { useKeypadListener } from 'hooks/useKeypadListener'
import { useRouter } from 'next/router'
import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { BiUserCircle } from 'react-icons/bi'
import { HiOutlineCommandLine } from 'react-icons/hi2'
import {
    MdCalendarToday,
    MdHome,
    MdInbox,
    MdMenu,
    MdQuestionAnswer,
    MdUpcoming,
} from 'react-icons/md'

function CommandMenu({
    handleMenu,
    handleProfileMenu,
}: {
    handleMenu: () => void
    handleProfileMenu: () => void
}) {
    const keyRef = useRef<Array<'o' | 'h'>>([])
    const MenuBtnRef = useRef<HTMLButtonElement | null>(null)
    const [isOpen, setOpen] = useState(false)

    const onClose = useCallback(() => {
        setOpen(false)
    }, [])

    const openHelphandler = useCallback(() => {
        MenuBtnRef.current?.click()
    }, [])

    const contents = useMemo(
        () => [
            {
                icon: <MdHome />,
                title: 'Go to home',
                code: 'G then H',
                route: '/app/today',
            },
            {
                icon: <MdInbox />,
                title: 'Go to Inbox',
                code: 'G then I',
                route: '/app/project/inbox',
            },
            {
                icon: <MdCalendarToday />,
                title: 'Go to Today',
                code: 'G then T',
                route: '/app/today',
            },
            {
                icon: <MdUpcoming />,
                title: 'Go to Upcoming',
                code: 'G then U',
                route: '/app/upcoming',
            },
            {
                icon: <BiUserCircle />,
                title: 'Open profile photo menu',
                code: 'O then U',
                btn: handleProfileMenu,
            },
            {
                icon: <MdQuestionAnswer />,
                title: 'Open help & information',
                code: 'O then H',
                btn: openHelphandler,
            },
            {
                icon: <MdMenu />,
                title: 'Open/Close sidebar menu',
                code: 'M',
                btn: handleMenu,
            },
        ],
        [openHelphandler, handleMenu, handleProfileMenu],
    )

    useKeypadListener(
        useCallback((e) => {
            if (e.key === 'k' && e.ctrlKey) {
                e.preventDefault()
                setOpen((prev) => !prev)
            }
        }, []),
    )

    useKeypadListener(
        useCallback(
            (e) => {
                if (keyRef.current.length === 2) {
                    keyRef.current.shift()
                }
                switch (e.key) {
                    case 'o':
                        keyRef.current.push(e.key)
                        break
                    case 'h':
                        keyRef.current.push(e.key)
                        break
                    default:
                        keyRef.current = []
                }
                if (keyRef.current.join(',') === 'o,h') {
                    openHelphandler()
                }
            },
            [openHelphandler],
        ),
    )

    return (
        <Fragment>
            <Menu className="relative" as="div">
                <Menu.Button
                    className="tooltip relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus-visible:bg-white/20"
                    ref={MenuBtnRef}
                >
                    <ToolTip className="top-full right-0 translate-y-2 after:-top-1 after:right-2.5">
                        Open help & info <kbd>O</kbd> then <kbd>H</kbd>
                    </ToolTip>
                    <AiOutlineQuestionCircle className="text-lg md:text-xl" />
                </Menu.Button>
                <Menu.Items className="absolute -right-4 z-10 w-52 rounded border border-gray-300 bg-white py-1 text-xsm text-gray-800 shadow shadow-gray-300">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={clsx(
                                    'flex w-full gap-x-2 whitespace-nowrap py-1 px-3',
                                    {
                                        'bg-gray-200': active,
                                    },
                                )}
                                onClick={() => setOpen(true)}
                            >
                                <HiOutlineCommandLine className="text-xl" />
                                Command Menu
                                <code className="ml-auto">crtl K</code>
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>
            <Transition
                show={isOpen}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog
                    onClose={setOpen}
                    className="fixed inset-0 z-[1000] flex items-center justify-center"
                >
                    <div className="fixed inset-0 bg-black/30"></div>
                    <Dialog.Panel className="fixed h-full max-h-[min(364px,100%-2rem)] w-full max-w-[min(500px,calc(100%-2rem))] overflow-auto rounded-md border border-gray-800 bg-gray-800 text-sm shadow-md">
                        <CommandAutoComplete
                            contents={contents}
                            onClose={onClose}
                        />
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </Fragment>
    )
}

interface Props {
    icon: JSX.Element
    title: string
    code: string
    route?: string
    btn?: () => void
}

function CommandAutoComplete({
    contents,
    onClose,
}: {
    contents: Array<Props>
    onClose: () => void
}) {
    const [value, setValue] = useState<Props>()
    const [query, setQuery] = useState('')
    const router = useRouter()

    const filterArray =
        query === ''
            ? contents
            : contents.filter((v) =>
                  v.title.toLowerCase().includes(query.toLowerCase()),
              )

    return (
        <Combobox
            value={value}
            onChange={(arg) => {
                setValue(arg)
                arg.route && router.push(arg.route)
                arg.btn?.()
                onClose()
            }}
        >
            <Combobox.Input
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                displayValue={(arg: any) => arg.title}
                className="h-12 w-full border-b border-b-gray-800 bg-gray-800 px-3 leading-10 text-white placeholder:text-gray-200 focus:outline-none"
                placeholder="What would you like to do?"
            />
            <Combobox.Options
                static
                className="absolute inset-x-0 top-12 bottom-0 overflow-auto bg-gray-700 text-white"
            >
                {filterArray.map((arg) => (
                    <Combobox.Option key={arg.title} value={arg} as={Fragment}>
                        {({ active }) => (
                            <button
                                className={clsx(
                                    'relative flex w-full justify-start gap-x-3 p-3',
                                    {
                                        'bg-gray-200 text-gray-900 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-red-500':
                                            active,
                                    },
                                )}
                            >
                                <span className="text-xl">{arg.icon}</span>

                                {arg.title}
                                <span className="ml-auto">{arg.code}</span>
                            </button>
                        )}
                    </Combobox.Option>
                ))}
            </Combobox.Options>
        </Combobox>
    )
}

export default CommandMenu
