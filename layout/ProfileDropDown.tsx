import ToolTip from '@/components/Tooltip'
import { auth } from '@/config/firebase'
import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { useAuth } from 'context/AuthContext'
import { signOut } from 'firebase/auth'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import { Fragment, useCallback } from 'react'
import { FaUser } from 'react-icons/fa'
import { MdLogout, MdSettings } from 'react-icons/md'
import { useProfileListener } from './useProfileListener'

function useLogout() {
    const router = useRouter()

    return useCallback(async () => {
        try {
            await signOut(auth)
            router.push('/auth/login')
        } catch (error) {
            console.error(error)
        }
    }, [router])
}

function ProfileDropDown() {
    const currentUser = useAuth()
    const menuButtonRef = useProfileListener()
    const username =
        currentUser?.displayName ?? currentUser?.email?.replace(/@.+/gi, '')!

    const handleLogOut = useLogout()

    return (
        <Menu as="div" className="relative">
            <Menu.Button as={Fragment}>
                <button
                    className="tooltip relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus-visible:bg-white/20"
                    ref={menuButtonRef}
                >
                    <ToolTip className="top-full right-0 translate-y-2 after:-top-1 after:right-2.5">
                        Open Profile Menu <kbd>O</kbd> then <kbd>U</kbd>
                    </ToolTip>
                    {currentUser?.photoURL ? (
                        <NextImage
                            src={currentUser.photoURL}
                            alt={username}
                            width={24}
                            height={24}
                            className="rounded-full"
                        />
                    ) : (
                        <FaUser className="text-lg md:text-xl" />
                    )}
                </button>
            </Menu.Button>

            <Menu.Items className="absolute top-full right-0 z-dropdown flex w-60 min-w-max translate-y-4 flex-col items-start divide-y rounded border bg-white px-1.5 py-2 text-xsm  text-gray-500 shadow-inner focus:outline-none">
                <Menu.Item>
                    {({ active }) => (
                        <button
                            className={clsx(
                                'w-full space-y-4 rounded px-3 py-2 text-start',
                                { 'bg-gray-200/75': active },
                            )}
                        >
                            <div className="flex gap-x-4">
                                {currentUser?.photoURL ? (
                                    <div className="relative aspect-square w-16">
                                        <NextImage
                                            src={currentUser.photoURL}
                                            alt={username}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="place-self-center rounded-full p-4">
                                        <FaUser className="text-3xl" />
                                    </div>
                                )}
                                <div className="flex flex-col justify-center tracking-wide">
                                    <span className="font-bold text-gray-900">
                                        {username}
                                    </span>
                                    <span className="font-normal">
                                        {currentUser?.email!}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <MdSettings className="text-xl" />
                                <div>Settings</div>
                            </div>
                        </button>
                    )}
                </Menu.Item>

                <Menu.Item>
                    {({ active }) => (
                        <button
                            className={clsx(
                                'flex w-full items-center gap-x-2 rounded px-3 py-2 text-start',
                                { 'bg-gray-200/75': active },
                            )}
                            onClick={handleLogOut}
                        >
                            <MdLogout className="text-xl" />
                            Log Out
                        </button>
                    )}
                </Menu.Item>
            </Menu.Items>
        </Menu>
    )
}

export default ProfileDropDown
