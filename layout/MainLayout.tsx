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
import { MdOutlineClose, MdOutlineMenu } from 'react-icons/md'
import CommandMenu from './CommandMenu'
import ProfileDropDown from './ProfileDropDown'
import FooterSidePanel from './SidePanel/FooterPanel'
import HeaderSidePanel from './SidePanel/HeaderPanel'
import { useProfileListener } from './useProfileListener'

function MainLayout({ children }: { children: React.ReactNode }) {
    const [isMenuOpened, setMenuOpen] = useState(false)
    const router = useRouter()
    const profileBtnRef = useProfileListener()

    const handleMenu = useCallback(() => {
        setMenuOpen((prev) => !prev)
    }, [])

    const handleProfileMenu = useCallback(() => {
        profileBtnRef.current?.click()
    }, [])

    //Listening to all go to keydown
    useGoToListener()

    // seting isMenuOpen to false every time page navigate to anthor page
    useEffect(() => {
        setMenuOpen(false)
    }, [router.basePath])

    useKeypadListener(
        useCallback(
            (e: KeyboardEvent) => {
                if (e.key === 'm') {
                    handleMenu()
                }
            },
            [handleMenu],
        ),
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
                        <FaHome className="text-lg md:text-xl" />
                    </NextLink>
                </div>

                <div
                    className="flex items-center gap-x-0.5 py-1.5 pr-2 sm:gap-x-1"
                    role="group"
                    aria-label="Menu"
                >
                    <AddTaskDialog />

                    <CommandMenu
                        handleMenu={handleMenu}
                        handleProfileMenu={handleProfileMenu}
                    />

                    <ProfileDropDown ref={profileBtnRef} />
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
