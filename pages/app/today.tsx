import AddTask from '@/components/AddTask'
import { Error } from '@/components/Error'
import { Spinner } from '@/components/FullScreenLoader'
import Task from '@/components/Task'
import { adminAuth } from '@/config/firebaseAdmin'
import { format, startOfDay } from 'date-fns'
import { useToGetAllTasks } from 'hooks/services'
import { ITask } from 'index'
import MainLayout from 'layout/MainLayout'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import nookies from 'nookies'
import { useMemo } from 'react'
import { NextPageWithLayout } from '../_app'

const Today: NextPageWithLayout = function Today() {
    const { state, error, isLoading } = useToGetAllTasks()

    const today = useMemo(() => startOfDay(new Date()), [])

    const overdue = state.filter((val) => val.dueDate < today.getTime())
    const ongoing = state.filter((val) => val.dueDate === today.getTime())

    return (
        <main className="mx-auto space-y-8 px-2 py-8 sm:w-10/12 sm:px-4">
            <Head>
                <title>Today: Todoist</title>
            </Head>

            <h1>
                <strong className="mr-2 text-xl">Today</strong>
                <span className="text-xs text-gray-500">
                    {format(today, 'EEE MMM d')}
                </span>
            </h1>

            <OverdueTask loading={isLoading} error={error} data={overdue} />

            <section className="space-y-2">
                <h3 className="flex items-center gap-x-1 text-sm font-bold leading-5">
                    {format(today, 'LLL d')}
                    <span>&middot;</span>
                    <span>Today</span>
                    <span>&middot;</span>
                    {format(today, 'EEEE')}
                </h3>

                <OngoingTask loading={isLoading} error={error} data={ongoing} />

                <AddTask />
            </section>
        </main>
    )
}

function OverdueTask({
    loading,
    error,
    data,
}: {
    loading: boolean
    error: string
    data: Array<ITask>
}) {
    switch (true) {
        case loading:
            return <Spinner />

        case !!error:
            return <Error>Error:- {error}</Error>

        case data.length === 0:
            return null

        default:
            return (
                <section className="space-y-2">
                    <h2 className="text-sm font-bold">Overdue</h2>
                    <ul className="flex flex-col gap-y-0.5 border-t border-t-gray-200">
                        {data.map((task) => (
                            <Task key={task.id} {...task} />
                        ))}
                    </ul>
                </section>
            )
    }
}

function OngoingTask({
    loading,
    error,
    data,
}: {
    loading: boolean
    error: string
    data: Array<ITask>
}) {
    switch (true) {
        case loading:
            return <Spinner />

        case !!error:
            return <Error>Error:- {error}</Error>

        case data.length === 0:
            return null

        default:
            return (
                <ul className="flex flex-col gap-y-0.5 pb-3">
                    {data.map((task) => (
                        <Task key={task.id} {...task} />
                    ))}
                </ul>
            )
    }
}

Today.getLayout = function (page) {
    return <MainLayout>{page}</MainLayout>
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const cookies = nookies.get(ctx)
    const token = cookies.token

    try {
        await adminAuth.verifyIdToken(token, true)
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

export default Today
