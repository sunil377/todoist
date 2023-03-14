import AddTask from '@/components/AddTask'
import FullScreenLoader, { Spinner } from '@/components/FullScreenLoader'
import NotFound from '@/components/NotFound'
import Task from '@/components/Task'
import { adminAuth } from '@/config/firebaseAdmin'
import { NextPageWithLayout } from '@/pages/_app'
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
                        <section>
                            <h1 className="text-xl font-bold capitalize">
                                {tags?.title}
                            </h1>
                            <ul className="mt-5">
                                <RenderTasks projectName={tags?.title} />
                            </ul>
                        </section>
                        <section className="mt-1">
                            <AddTask />
                        </section>
                    </main>
                </>
            )
    }
}

function RenderTasks({ projectName }: { projectName?: string }) {
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
                where('completed', '==', false),
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
            return <div>No Task Found</div>

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
