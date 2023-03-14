import { Disclosure } from '@headlessui/react'
import { format } from 'date-fns'
import { Formik } from 'formik'
import { Fragment } from 'react'
import { MdOutlineAdd } from 'react-icons/md'
import { useToCreateTask } from './hooks'
import TaskForm from './TaskForm'
import { validateTask } from './util'

const INITIAL_VALUES = {
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    project: 'inbox',
}

function RenderComponent({ close }: { close: React.ReactNode }) {
    const mutation = useToCreateTask()

    return (
        <>
            <Formik
                initialValues={INITIAL_VALUES}
                validate={validateTask}
                onSubmit={(values, helpers) => {
                    mutation.mutate({
                        values,
                        helpers,
                    })
                }}
            >
                {(formikprops) => {
                    return <TaskForm close={close} {...formikprops} />
                }}
            </Formik>
        </>
    )
}

function AddTask() {
    return (
        <Disclosure>
            {({ open }) => (
                <Fragment>
                    {!open && (
                        <Disclosure.Button className="group flex w-full items-center justify-start gap-x-2 rounded px-2 py-1 text-xsm focus:outline-none  focus-visible:ring-1 focus-visible:ring-indigo-300">
                            <span className="inline-flex items-center justify-center rounded-full text-skin-main transition-colors group-hover:bg-skin-main group-hover:text-white">
                                <MdOutlineAdd
                                    className="text-2xl"
                                    aria-hidden
                                />
                            </span>
                            <span className="font-normal text-gray-500 transition-colors group-hover:text-skin-dark">
                                Add Task
                            </span>
                        </Disclosure.Button>
                    )}

                    <Disclosure.Panel className="focus:outline-none">
                        {({ close }) => (
                            <RenderComponent
                                close={
                                    <button
                                        type="button"
                                        className="flex-shrink-0 rounded border-4 border-transparent px-2 py-1 font-medium text-gray-500 hover:text-gray-800"
                                        onClick={() => close()}
                                    >
                                        Cancel
                                    </button>
                                }
                            />
                        )}
                    </Disclosure.Panel>
                </Fragment>
            )}
        </Disclosure>
    )
}

export { AddTask as default, RenderComponent as AddTaskComponent }
