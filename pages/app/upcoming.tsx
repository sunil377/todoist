import AddTask from '@/components/AddTask'
import Task from '@/components/Task'
import { adminAuth } from '@/config/firebaseAdmin'
import { useGetUpcomingTasks } from 'hooks/services'
import MainLayout from 'layout/MainLayout'
import { GetServerSidePropsContext } from 'next'
import nookies from 'nookies'
import { NextPageWithLayout } from '../_app'

const Upcoming: NextPageWithLayout = function Upcoming({ ...props }) {
    const { state: tasks } = useGetUpcomingTasks()

    return (
        <>
            <main className="px-4 pt-8 sm:mx-auto sm:w-10/12">
                <section>
                    <h1 className="text-xl font-bold">Upcoming</h1>
                    <ul className="mt-5">
                        {tasks.length > 0 &&
                            tasks.map((t) => <Task key={t.id} {...t} />)}
                    </ul>
                </section>
                <section className="mt-1">
                    <AddTask />
                </section>
            </main>
        </>
    )
}

Upcoming.getLayout = function (page) {
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

export default Upcoming
