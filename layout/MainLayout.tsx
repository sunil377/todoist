import AddTaskDialog from '@/components/AddTask/AddTaskDialog'
import { default as ToolTip } from '@/components/Tooltip'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import useGoToListener from 'hooks/useGoToListener'
import { useKeypadListener } from 'hooks/useKeypadListener'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { FaHome } from 'react-icons/fa'
import {
    MdAddAlert,
    MdOutlineAutoGraph,
    MdOutlineClose,
    MdOutlineMenu,
    MdQuestionAnswer,
} from 'react-icons/md'
import ProfileDropDown from './ProfileDropDown'
import FooterSidePanel from './SidePanel/FooterPanel'
import HeaderSidePanel from './SidePanel/HeaderPanel'

function MainLayout({ children }: { children: React.ReactNode }) {
    const [isMenuOpened, setMenuOpen] = useState(false)
    const router = useRouter()

    //Listening to all go to keydown
    useGoToListener()

    // seting isMenuOpen to false every time page navigate to anthor page
    useEffect(() => {
        function onComplete() {
            setMenuOpen(false)
        }
        router.events.on('routeChangeComplete', onComplete)
        return () => {
            router.events.off('routeChangeComplete', onComplete)
        }
    }, [router.events])

    useKeypadListener(
        useCallback((e: KeyboardEvent) => {
            if (e.key === 'm') {
                setMenuOpen((prev) => !prev)
            }
        }, []),
    )

    return (
        <div className="mx-auto flex min-h-screen max-w-screen-2xl flex-col">
            <nav
                className="relative z-40 flex h-12 items-center justify-between gap-x-2 bg-skin-main text-white"
                role="banner"
            >
                <div className="flex items-center gap-x-0.5 py-1.5 pl-2">
                    <Switch
                        className="tooltip relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus-visible:bg-white/10"
                        aria-label="Main Menu"
                        checked={isMenuOpened}
                        onChange={() => setMenuOpen((prev) => !prev)}
                    >
                        <ToolTip className="top-full left-0 translate-y-2 after:-top-1 after:left-1.5">
                            {isMenuOpened ? 'Close' : 'Open'} Menu <kbd>M</kbd>
                        </ToolTip>

                        <i aria-hidden className="text-xl sm:text-2xl">
                            {isMenuOpened ? (
                                <MdOutlineClose />
                            ) : (
                                <MdOutlineMenu />
                            )}
                        </i>
                    </Switch>

                    <NextLink
                        href="/app/today"
                        className="tooltip relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus-visible:bg-white/20"
                    >
                        <ToolTip className="top-full left-0 translate-y-2 after:-top-1 after:left-3">
                            Go To Home <kbd>G</kbd> Then <kbd>H</kbd>
                        </ToolTip>
                        <FaHome className="text-xl md:text-2xl" />
                    </NextLink>

                    {/* <label
                        className="group relative mr-auto flex items-center rounded bg-white bg-opacity-20 p-0.5 transition-colors focus-within:bg-white hover:bg-white"
                        htmlFor="search"
                    >
                        <div className="left-0 flex items-center group-focus-within:absolute group-focus-within:z-10 group-focus-within:min-w-[50vw] group-focus-within:bg-white sm:group-focus-within:static sm:group-focus-within:z-0 sm:group-focus-within:min-w-full sm:group-focus-within:bg-transparent">
                            <div
                                className="pointer-events-none inline-flex select-none items-center justify-center rounded-full p-1 group-focus-within:text-gray-500 group-hover:text-gray-600"
                                role="presentation"
                            >
                                <SearchIcon aria-hidden className="text-lg" />
                            </div>

                            <input
                                type="text"
                                placeholder="Search"
                                id="search"
                                className="h-0 w-0 bg-transparent text-xsm placeholder:text-white focus:text-black focus:outline-none focus:placeholder:text-gray-600 group-focus-within:h-auto group-focus-within:w-auto group-hover:placeholder:text-gray-600 sm:h-auto sm:w-auto"
                                autoComplete="off"
                            />

                            <button
                                className="hidden select-none items-center justify-center rounded-full p-1 text-xl leading-6 text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-main group-focus-within:inline-flex group-hover:inline-flex"
                                aria-label="close"
                            >
                                <MdOutlineClose aria-hidden />
                            </button>
                        </div>
                    </label> */}
                </div>

                <div
                    className="flex items-center gap-x-0.5 py-1.5 pr-2"
                    role="group"
                    aria-label="Menu"
                >
                    <AddTaskDialog />

                    <button className="tooltip relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus-visible:bg-white/20">
                        <ToolTip className="top-full left-1/2 -translate-x-1/2 translate-y-2 after:-top-1 after:left-1/2 after:-translate-x-1/2">
                            Open Productivity <kbd>O</kbd> then <kbd>P</kbd>
                        </ToolTip>
                        <MdOutlineAutoGraph className="text-xl md:text-2xl" />
                    </button>

                    <button className="tooltip relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus-visible:bg-white/20">
                        <ToolTip className="top-full right-0 translate-y-2 after:-top-1 after:right-2.5">
                            Open help & info <kbd>O</kbd> then <kbd>H</kbd>
                        </ToolTip>
                        <MdQuestionAnswer className="text-xl md:text-2xl" />
                    </button>

                    <button className="tooltip relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus-visible:bg-white/20">
                        <ToolTip className="top-full right-0 translate-y-2 after:-top-1 after:right-2.5">
                            Open Notification <kbd>O</kbd> then <kbd>N</kbd>
                        </ToolTip>
                        <MdAddAlert className="text-xl md:text-2xl" />
                    </button>

                    <ProfileDropDown />
                </div>
            </nav>
            {isMenuOpened && (
                <Fragment>
                    <div className="absolute inset-0 z-10 bg-black/30 sm:hidden" />
                    <button
                        className="tooltip fixed top-14 right-5 z-20 text-3xl font-semibold text-white sm:hidden"
                        onClick={() => setMenuOpen(false)}
                    >
                        <ToolTip className="top-full left-1/2 translate-y-2 -translate-x-1/2 after:-top-1.5 after:left-1/2 after:-translate-x-1/2">
                            Close
                        </ToolTip>
                        &times;
                    </button>
                </Fragment>
            )}

            <div className="2xl:flex">
                <div
                    className={`fixed top-12 z-10 h-full w-56 bg-white transition-all duration-500 sm:w-64 2xl:static 2xl:float-left 2xl:w-72 2xl:duration-150 ${
                        isMenuOpened ? 'visible left-0' : 'invisible -left-64'
                    }`}
                >
                    <div className="space-y-5 p-5">
                        <HeaderSidePanel />
                        <FooterSidePanel />
                    </div>
                </div>

                <div
                    className={clsx(
                        'transition-all duration-500 2xl:float-left 2xl:basis-full 2xl:transition-none',
                        isMenuOpened ? 'sm:ml-56 2xl:ml-0' : 'sm:ml-0',
                    )}
                >
                    <div className="mx-[clamp(1rem,2vw,3rem)] my-[0.5vw] xl:mx-auto xl:max-w-5xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainLayout
