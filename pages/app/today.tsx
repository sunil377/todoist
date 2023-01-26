import AddTask from '@/components/AddTask'
import { adminDB } from '@/config/firebaseAdmin'
import { format } from 'date-fns'
import MainLayout from 'layout/MainLayout'
import { GetStaticPathsContext, InferGetStaticPropsType } from 'next'
import NextLink from 'next/link'
import PlusIcon from 'public/assets/plus.svg'
import SettingsIcon from 'public/assets/settings.svg'
import { useCallback, useEffect, useState } from 'react'
import { NextPageWithLayout } from '../_app'

const Today: NextPageWithLayout<
    InferGetStaticPropsType<typeof getStaticProps>
> = function Today(props) {
    console.log('props', props)

    const [currentDate, setCurrentDate] = useState<Date | null>(null)
    const [isTaskOpened, setTaskOpen] = useState(false)

    const handleTask = useCallback(() => setTaskOpen(false), [])

    useEffect(() => {
        setCurrentDate(new Date())
    }, [])

    return (
        <main className="mx-auto  w-10/12 space-y-8 py-8">
            <div className="flex justify-between">
                <h1>
                    <strong className="mr-2 text-xl">Today</strong>
                    <span className="text-xs text-gray-500">
                        {currentDate && format(currentDate, 'EEE MMM d')}
                    </span>
                </h1>
                <button
                    aria-label="view"
                    className="text-gray-500"
                    data-tooltip="view"
                >
                    <SettingsIcon aria-hidden />
                </button>
            </div>
            <section className="space-y-2">
                <div className="flex justify-between text-sm">
                    <h2 className="font-bold ">Overdue</h2>

                    <NextLink
                        href="/reshedule"
                        className="text-skin-main hover:underline"
                    >
                        Reschedule
                    </NextLink>
                </div>
                <ul className="flex flex-col"></ul>
            </section>

            <section className="space-y-2">
                <h3 className="flex items-center gap-x-1 text-sm font-bold leading-5">
                    {currentDate && format(currentDate, 'LLL d')}
                    <span>&middot;</span>
                    <span>Today</span>
                    <span>&middot;</span>
                    {currentDate && format(currentDate, 'EEEE')}
                </h3>

                {isTaskOpened ? (
                    <AddTask onClose={handleTask} />
                ) : (
                    <button
                        className="group w-full justify-start gap-x-2 border-t-gray-300 py-1 text-xsm outline-none focus-visible:border-blue-300"
                        onClick={() => setTaskOpen(true)}
                    >
                        <PlusIcon
                            className="scale-90 transform text-skin-main group-hover:rounded-full group-hover:bg-skin-main group-hover:text-white"
                            aria-hidden
                        />
                        <span className="font-normal text-gray-400 group-hover:text-skin-dark">
                            Add Task
                        </span>
                    </button>
                )}
            </section>
        </main>
    )
}

export async function getStaticProps(context: GetStaticPathsContext) {
    try {
        const response = await adminDB.collection('tasks').get()

        if (response.empty) {
            return {
                props: {
                    status: 'failed',
                    message: 'No Document Found',
                },
            }
        }

        const tasks = [...response.docs].reduce((totol, current) => {
            return [...totol, { ...current.data(), id: current.id }]
        }, [] as Array<FirebaseFirestore.DocumentData>)

        try {
            const props = JSON.stringify({
                status: 'success',
                tasks,
            })

            return {
                props: JSON.parse(props),
            }
        } catch (error) {
            return {
                props: {
                    status: 'failed',
                    message:
                        'Error during parse JSON oject' +
                        (error as Error).message,
                },
            }
        }
    } catch (error) {
        return {
            props: {
                status: 'failed',
                messgae: 'error geting document: ' + (error as Error).message,
            },
        }
    }
}

Today.getLayout = function (page) {
    return <MainLayout>{page}</MainLayout>
}

export default Today
