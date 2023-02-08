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
        <div
            className={`group/menu overflow-hidden ${
                isMenuOpened ? ' active ' : ''
            }`}
        >
            <nav
                className="z-navbar flex h-[44px] items-center gap-x-8 bg-skin-main px-5 text-white"
                role="banner"
            >
                <div className="flex flex-grow items-center gap-x-1 lg:flex-grow-0">
                    <label
                        className="group relative inline-block aspect-square h-8 w-8 cursor-pointer p-0.5 focus-within:bg-white/10 hover:bg-white/10"
                        aria-label="main menu"
                    >
                        <input
                            type="checkbox"
                            className="peer h-0 w-0 appearance-none outline-none"
                            aria-controls="main-navigation"
                            checked={isMenuOpened}
                            onChange={() => setMenu((prev) => !prev)}
                        />

                        <span className="invisible absolute bottom-0 left-1/2 z-tooltip w-max translate-y-[42px] -translate-x-1/2 rounded bg-black px-2.5 py-2 text-sm text-white transition-opacity duration-500 group-hover:visible peer-focus-visible:visible">
                            {isMenuOpened ? 'close' : 'open'}
                        </span>

                        <i
                            aria-hidden
                            className="invisible absolute inset-0 inline-flex items-center justify-center peer-checked:visible"
                        >
                            <MenuCloseIcon />
                        </i>

                        <i
                            aria-hidden
                            className="visible absolute inset-0 inline-flex items-center justify-center peer-checked:invisible"
                        >
                            <MenuOpenIcon />
                        </i>
                    </label>

                    <button className="group relative h-8 w-8 p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10">
                        <span className="invisible absolute bottom-0 left-1/2 z-tooltip w-max translate-y-[42px] -translate-x-1/2 rounded bg-black px-2.5 py-2 text-sm text-white transition-opacity duration-500 group-hover:visible group-focus-visible:visible">
                            Go To Home
                        </span>
                        <HomeIcon aria-hidden />
                    </button>

                    <div className="group mr-auto flex w-full items-center gap-x-2 rounded bg-white/10 px-1 py-1 transition-colors focus-within:bg-white hover:bg-white lg:min-w-[250px] focus-within:lg:min-w-[360px]">
                        <SearchIcon
                            className="shrink-0 group-focus-within:text-gray-600 group-hover:text-gray-600"
                            aria-hidden
                        />

                        <input
                            type="text"
                            placeholder="Search"
                            className="peer w-full bg-transparent text-xsm outline-none placeholder:text-white focus:text-black focus:placeholder:text-gray-600 group-hover:placeholder:text-gray-600"
                            autoComplete="off"
                            aria-autocomplete="none"
                        />

                        <button
                            className="invisible shrink-0 group-focus-within:visible"
                            aria-label="close"
                        >
                            <MenuCloseIcon
                                aria-hidden
                                className="text-gray-600"
                            />
                        </button>
                    </div>
                </div>

                <div
                    className="ml-auto flex items-center gap-x-2"
                    role="group"
                    aria-label="Menu"
                >
                    <button className="group relative h-8 w-8 p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10">
                        <span className="invisible absolute bottom-0 left-1/2 z-tooltip w-max translate-y-[42px] -translate-x-1/2 rounded bg-black px-2.5 py-2 text-sm text-white transition-opacity duration-500 group-hover:visible group-focus-visible:visible">
                            Add Task Q
                        </span>
                        <PlusIcon aria-hidden />
                    </button>

                    <button className="group relative h-8 w-8 p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10">
                        <span className="invisible absolute bottom-0 left-1/2 z-tooltip w-max translate-y-[42px] -translate-x-1/2 rounded bg-black px-2.5 py-2 text-sm text-white transition-opacity duration-500 group-hover:visible group-focus-visible:visible">
                            Open Productivity O then P
                        </span>
                        <GraphIcon aria-hidden />
                    </button>

                    <button className="group relative h-8 w-8 p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10">
                        <span className="invisible absolute bottom-0 right-0 z-tooltip w-max translate-y-[42px] translate-x-1/3 rounded bg-black px-2.5 py-2 text-sm text-white transition-opacity duration-500 group-hover:visible group-focus-visible:visible">
                            Open help & information O then H
                        </span>
                        <QuestionIcon aria-hidden />
                    </button>

                    <button className="group relative h-8 w-8 p-0.5 outline-none hover:bg-white/10 focus-visible:bg-white/10">
                        <span className="invisible absolute bottom-0 right-0 z-tooltip w-max translate-y-[42px] translate-x-1/4 rounded bg-black px-2.5 py-2 text-sm text-white transition-opacity duration-500 group-hover:visible group-focus-visible:visible">
                            Open Notification O then N
                        </span>
                        <BellIcon aria-hidden />
                    </button>

                    <button className="group relative  border border-transparent p-0.5 outline-none focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black">
                        <span className="invisible absolute bottom-0 right-0 z-tooltip w-max translate-y-[42px] rounded bg-black px-2.5 py-2 text-sm text-white transition-opacity duration-500 group-hover:visible group-focus-visible:visible">
                            Open proile menu pvisible U
                        </span>

                        {currentUser?.photoURL ? (
                            <NextImage
                                src={currentUser.photoURL}
                                alt={currentUser.displayName ?? ''}
                                width={20}
                                height={20}
                                className="h-6 w-6 rounded-full"
                            />
                        ) : (
                            <span className="inline-block h-6 w-6 capitalize">
                                {currentUser?.email?.charAt(0) ?? 'R'}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            <div className="relative flex min-h-screen bg-white">
                <div className="absolute inset-0 z-40 bg-black/50 group-[:not(.active)]/menu:hidden md:hidden" />

                <div
                    className="invisible z-50 min-w-0 basis-0 -translate-x-[1440px] bg-white transition-all duration-500 group-[.active]/menu:visible group-[.active]/menu:fixed group-[.active]/menu:inset-y-0 group-[.active]/menu:left-0 group-[.active]/menu:right-1/2 group-[.active]/menu:top-[44px] group-[.active]/menu:translate-x-0 md:group-[.active]/menu:relative md:group-[.active]/menu:top-0 md:group-[.active]/menu:right-auto md:group-[.active]/menu:basis-1/3"
                    id="main-navigation"
                >
                    <div className="space-y-5 p-5">
                        <div className="flex flex-col">
                            <button className="flex justify-start gap-x-1 px-1 py-1.5 text-sm font-normal outline-none hover:border-blue-300 hover:bg-blue-100 focus-visible:border-blue-300 focus-visible:bg-blue-100 [&[data-active='true']]:bg-blue-100/60">
                                <InboxIcon
                                    aria-hidden
                                    className="text-blue-500"
                                />
                                Inbox
                            </button>

                            <NavLink
                                to="/app/today"
                                className="flex justify-start gap-x-1 px-1 py-1.5 text-sm outline-none hover:border-blue-300 hover:bg-blue-100 focus-visible:border-blue-300 focus-visible:bg-blue-100 [&[data-active='true']]:bg-blue-100/60"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    className="text-green-700"
                                >
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
                                            <tspan
                                                x="8"
                                                y="15"
                                                textAnchor="middle"
                                            >
                                                {new Date().getDate()}
                                            </tspan>
                                        </text>
                                    </g>
                                </svg>
                                Today
                            </NavLink>

                            <NavLink
                                to="/app/upcoming"
                                className="flex justify-start gap-x-1 px-1 py-1.5 text-sm outline-none hover:border-blue-300 hover:bg-blue-100 focus-visible:border-blue-300 focus-visible:bg-blue-100 [&[data-active='true']]:bg-blue-100/60"
                            >
                                <CalenderIcon
                                    aria-hidden
                                    className="text-purple-500"
                                />
                                Upcoming
                            </NavLink>

                            <NavLink
                                to="/app/filter-labels"
                                className="flex justify-start gap-x-1 px-1 py-1.5 text-sm outline-none hover:border-blue-300 hover:bg-blue-100 focus-visible:border-blue-300 focus-visible:bg-blue-100 [&[data-active='true']]:bg-blue-100/60"
                            >
                                <TabIcon
                                    aria-hidden
                                    className="text-yellow-500"
                                />
                                Filters & Labels
                            </NavLink>
                        </div>

                        <div className="flex flex-col">
                            <h4 className="mb-4 text-sm text-blue-500">
                                Projects
                            </h4>
                            <button className="flex justify-start px-1 py-1.5 text-sm font-normal outline-none hover:bg-blue-100 focus-visible:border-blue-800">
                                Personal
                            </button>
                            <button className="flex justify-start px-1 py-1.5 text-sm font-normal outline-none hover:bg-blue-100 focus-visible:border-blue-800">
                                Shopping
                            </button>
                        </div>
                    </div>
                </div>

                <div className="basis-full bg-white">
                    <div className="mx-auto max-w-5xl">{children}</div>
                </div>
            </div>
        </div>
    )
}

export default MainLayout
