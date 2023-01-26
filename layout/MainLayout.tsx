import NavLink from 'components/NavLink'
import { useAuth } from 'context/AuthContext'
import NextImage from 'next/image'
import BellIcon from 'public/assets/bell.svg'
import CalenderIcon from 'public/assets/calender.svg'
import GraphIcon from 'public/assets/graph.svg'
import HomeIcon from 'public/assets/home.svg'
import InboxIcon from 'public/assets/inbox.svg'
import MenuCloseIcon from 'public/assets/menu-close-icon.svg'
import MenuOpenIcon from 'public/assets/menu-open-icon.svg'
import PlusIcon from 'public/assets/plus.svg'
import QuestionIcon from 'public/assets/question.svg'
import SearchIcon from 'public/assets/search.svg'
import TabIcon from 'public/assets/tab.svg'
import React, { useState } from 'react'

function MainLayout({ children }: { children: React.ReactNode }) {
    const currentUser = useAuth()
    const [isMenuOpened, setMenu] = useState(false)

    return (
        <div className="overflow-hidden">
            <nav className="z-navbar flex h-[44px] items-center gap-x-8 bg-skin-main px-4 text-white" role="banner">
                <div className="flex flex-grow items-center gap-x-1 lg:flex-grow-0">
                    <button
                        className="p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10"
                        aria-label="Main Menu"
                        role="switch"
                        aria-checked={isMenuOpened}
                        onClick={() => setMenu((prev) => !prev)}
                    >
                        <i className={isMenuOpened ? 'inline' : 'hidden'} aria-hidden>
                            <MenuCloseIcon />
                        </i>

                        <i className={isMenuOpened ? 'hidden' : 'inline'} aria-hidden>
                            <MenuOpenIcon />
                        </i>
                    </button>

                    <button className="p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10" data-tooltip="Go To Home">
                        <HomeIcon aria-hidden />
                    </button>

                    <div className="group mr-auto flex w-full items-center gap-x-2 rounded bg-white/10 px-1 py-1 transition-colors focus-within:bg-white hover:bg-white lg:min-w-[250px] focus-within:lg:min-w-[360px]">
                        <SearchIcon className="shrink-0 group-focus-within:text-gray-600 group-hover:text-gray-600" aria-hidden />

                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-transparent text-xsm outline-none placeholder:text-white focus:text-black focus:placeholder:text-gray-600 group-hover:placeholder:text-gray-600"
                            autoComplete="off"
                            aria-autocomplete="none"
                        />

                        <button className="hidden shrink-0 group-focus-within:inline-flex" aria-label="close">
                            <MenuCloseIcon className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-x-2" role="group" aria-label="Menu">
                    <button className="p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10" data-tooltip="Add Task Q">
                        <PlusIcon aria-hidden />
                    </button>

                    <button className="p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10" data-tooltip="Open Productivity O then P">
                        <GraphIcon aria-hidden />
                    </button>

                    <button
                        className="p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10"
                        data-tooltip="Open help & information O then H"
                        data-position="right"
                    >
                        <QuestionIcon aria-hidden />
                    </button>

                    <button
                        className="p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10"
                        data-tooltip="Open Notification O then N"
                        data-position="right"
                    >
                        <BellIcon aria-hidden />
                    </button>

                    <button className="overflow-hidden rounded-full p-0.5" data-position="right" data-tooltip={currentUser?.email ?? 'unknown'}>
                        {currentUser?.photoURL ? (
                            <NextImage
                                src={currentUser.photoURL}
                                alt={currentUser.email ?? ''}
                                width={20}
                                height={20}
                                className="h-5 w-5 rounded-full"
                            />
                        ) : (
                            <span className="inline-block h-6 w-6 capitalize">{currentUser?.email?.charAt(0) ?? 'R'}</span>
                        )}
                    </button>
                </div>
            </nav>

            <div className="relative flex min-h-screen">
                {isMenuOpened && <div className="absolute inset-0 z-10 bg-black/50 md:hidden"></div>}

                <div
                    className={`absolute inset-y-0 right-1/2 left-0 z-20 transform bg-white  md:relative md:transition-["flex-basis,transform"] md:duration-500 ${
                        isMenuOpened ? 'translate-x-0 md:basis-1/3 lg:basis-1/4' : ' min-w-0 -translate-x-full md:basis-0'
                    }`}
                >
                    <div className={`bg-gray-50 transition-colors delay-500 ${isMenuOpened ? 'visible' : 'invisible'}`}>
                        <div className="space-y-5 p-5">
                            <div className="flex flex-col">
                                <button className="flex justify-start gap-x-1 px-1 py-1.5 text-sm font-normal outline-none hover:bg-gray-200 focus-visible:border-blue-800">
                                    <InboxIcon aria-hidden className="text-blue-500" />
                                    Inbox
                                </button>

                                <NavLink
                                    to="/app/today"
                                    className="flex justify-start gap-x-1 px-1 py-1.5 text-sm font-normal outline-none hover:bg-gray-200 focus-visible:border-blue-800 [&[data-active='true']]:bg-gray-200"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-green-700">
                                        <g fill="currentColor" fillRule="evenodd">
                                            <path
                                                fillRule="nonzero"
                                                d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v2.5h-15V6A1.5 1.5 0 0 1 6 4.5z"
                                                opacity=".1"
                                            ></path>
                                            <path
                                                fillRule="nonzero"
                                                d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6zm1 3h10a.5.5 0 1 1 0 1H7a.5.5 0 0 1 0-1z"
                                            ></path>
                                            <text
                                                fontFamily="-apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
                                                fontSize="9"
                                                transform="translate(4 2)"
                                                fontWeight="500"
                                            >
                                                <tspan x="8" y="15" textAnchor="middle">
                                                    {new Date().getDate()}
                                                </tspan>
                                            </text>
                                        </g>
                                    </svg>
                                    Today
                                </NavLink>

                                <NavLink
                                    to="/app/upcoming"
                                    className="flex justify-start gap-x-1 px-1 py-1.5 text-sm font-normal outline-none hover:bg-gray-200 focus-visible:border-blue-800 [&[data-active='true']]:bg-gray-200"
                                >
                                    <CalenderIcon aria-hidden className="text-purple-500" />
                                    Upcoming
                                </NavLink>

                                <NavLink
                                    to="/app/filter-labels"
                                    className="flex justify-start gap-x-1 px-1 py-1.5 text-sm outline-none hover:bg-gray-200 focus-visible:border-blue-800 [&[data-active='true']]:bg-gray-200"
                                >
                                    <TabIcon aria-hidden className="text-yellow-500" />
                                    Filters & Labels
                                </NavLink>
                            </div>

                            <div className="flex flex-col">
                                <h4 className="mb-4 text-sm text-gray-500">Projects</h4>
                                <button className="flex justify-start px-1 py-1.5 text-sm font-normal outline-none hover:bg-gray-200 focus-visible:border-blue-800">
                                    Personal
                                </button>
                                <button className="flex justify-start px-1 py-1.5 text-sm font-normal outline-none hover:bg-gray-200 focus-visible:border-blue-800">
                                    Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-grow">
                    <div className="mx-auto max-w-5xl">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default MainLayout
