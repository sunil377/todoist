import AddTask from '@/components/AddTask'
import FullScreenLoader, { Spinner } from '@/components/FullScreenLoader'
import NotFound from '@/components/NotFound'
import Task from '@/components/Task'
import { adminAuth } from '@/config/firebaseAdmin'
import { NextPageWithLayout } from '@/pages/_app'
import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { useAuth } from 'context/AuthContext'
import { onSnapshot, query, where } from 'firebase/firestore'
import {
    getProjectRef,
    getTaskCollectionRef,
    getTasksFormSnapShot,
} from 'hooks/services'
import { IProject, ITask } from 'index'
import MainLayout from 'layout/MainLayout'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { Fragment, useEffect, useState } from 'react'
import { MdIncompleteCircle, MdMoreHoriz } from 'react-icons/md'

function useProjectTasks() {
    const [tags, setTags] = useState<IProject | null>(null)
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const currentUser = useAuth()
    const router = useRouter()
    const slug = router.query.id

    useEffect(() => {
        if (!currentUser || typeof slug != 'string') {
            return
        }

        return onSnapshot(
            getProjectRef(currentUser.uid, slug),
            (res) => {
                if (res.exists()) {
                    setTags({ id: res.id, ...res.data() } as IProject)
                }
                setLoading(false)
            },
            (err) => {
                console.log(err)
                setError(err.message)
                setLoading(false)
            },
        )
    }, [currentUser, slug])

    return {
        tags,
        isLoading,
        error,
    }
}

const Project: NextPageWithLayout = function Project(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const { error, isLoading, tags } = useProjectTasks()
    const [isCompletedShowing, setCompletedShowing] = useState(false)

    switch (true) {
        case isLoading:
            return <FullScreenLoader />

        case !!error:
            return <div role="alert">{error}</div>

        case !tags:
            return <NotFound statusCode={404} />

        default:
            return (
                <>
                    <main className="px-4 pt-8 sm:mx-auto sm:w-10/12">
                        <section className="flex items-center justify-between">
                            <h1 className="text-xl font-bold capitalize">
                                {tags?.title}
                            </h1>
                            <div className="relative">
                                <Menu>
                                    <Menu.Button className="rounded bg-transparent p-1.5 align-middle text-xl leading-5 transition-colors hover:bg-gray-300">
                                        <MdMoreHoriz />
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 z-10 h-auto w-60 max-w-sm overflow-auto whitespace-nowrap rounded border border-gray-300 bg-white py-1 text-sm font-normal text-gray-600 shadow-md shadow-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-2">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={clsx(
                                                        'flex w-full gap-x-2 py-1 pl-4 transition-colors focus:outline-none',
                                                        {
                                                            'bg-gray-200':
                                                                active,
                                                        },
                                                    )}
                                                    onClick={() =>
                                                        setCompletedShowing(
                                                            (prev) => !prev,
                                                        )
                                                    }
                                                >
                                                    <MdIncompleteCircle className="text-xl" />

                                                    <span>
                                                        {isCompletedShowing
                                                            ? 'Hide'
                                                            : 'Show'}{' '}
                                                        completed
                                                    </span>
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        </section>
                        <section>
                            <ul className="mt-5">
                                <RenderTasks projectName={tags?.title} />
                            </ul>
                        </section>
                        <section className="mt-1">
                            <AddTask initialProject={tags?.title ?? 'inbox'} />

                            {isCompletedShowing && (
                                <div>
                                    <h4 className="mt-8 mb-4 font-semibold">
                                        Completed Tasks
                                    </h4>

                                    <RenderTasks
                                        projectName={tags?.title}
                                        isCompletedShowing={true}
                                    />
                                </div>
                            )}
                        </section>
                    </main>
                </>
            )
    }
}

function RenderTasks({
    projectName,
    isCompletedShowing = false,
}: {
    projectName?: string
    isCompletedShowing?: boolean
}) {
    const currentUser = useAuth()
    const [state, setState] = useState<Array<ITask>>([])
    const [error, setError] = useState('')
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        if (!currentUser || !projectName) {
            return
        }

        return onSnapshot(
            query(
                getTaskCollectionRef(currentUser.uid),
                where('completed', '==', isCompletedShowing),
                where('project', '==', projectName),
            ),
            (snapshot) => {
                const tasks = getTasksFormSnapShot(snapshot)
                setState(tasks)
                setLoading(false)
            },
            (err) => {
                alert(err.message)
                setLoading(false)
                setError(err.code)
                console.log(err.message)
            },
        )
    }, [currentUser, projectName])

    switch (true) {
        case isLoading:
            return <Spinner />

        case !!error:
            return <div role="alert">{error}</div>

        case state.length === 0:
            return (
                <div className="text-sm">
                    No {isCompletedShowing ? 'completed' : ''} Task Found
                </div>
            )

        default:
            return (
                <Fragment>
                    {state.map((t) => (
                        <Task key={t.id} {...t} />
                    ))}
                </Fragment>
            )
    }
}

Project.getLayout = function (page) {
    return <MainLayout>{page}</MainLayout>
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies.token

    try {
        await adminAuth.verifyIdToken(token)

        return {
            props: {},
        }
    } catch (error) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        }
    }
}

export default Project
