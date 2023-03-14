import { Dialog, Transition } from '@headlessui/react'
import { format } from 'date-fns'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useKeypadListener } from 'hooks/useKeypadListener'
import { ITask } from 'index'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import ToolTip from '../Tooltip'
import { useToCreateTask } from './hooks'
import ProjectPicker from './ProjectPicker'
import { validateTask } from './util'

function AddTaskDialog() {
    const [isOpen, setOpen] = useState(false)
    const handleCreateTask = useToCreateTask()

    const onkeydown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'q') {
            e.preventDefault()
            setOpen((prev) => !prev)
        }
    }, [])

    useKeypadListener(onkeydown)
    const errorKeys: Array<keyof ITask> = useMemo(
        () => ['dueDate', 'project', 'description', 'title'],
        [],
    )

    return (
        <Fragment>
            <button
                className="tooltip relative rounded-full p-2 hover:bg-white/10 focus:outline-none focus-visible:bg-white/20"
                onClick={() => setOpen(true)}
            >
                <ToolTip className="top-full left-1/2 -translate-x-1/2 translate-y-2 after:-top-1 after:left-1/2 after:-translate-x-1/2">
                    Add Task <kbd>Q</kbd>
                </ToolTip>
                <MdAdd className="text-xl md:text-2xl" />
            </button>

            <Transition
                show={isOpen}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
                as={Fragment}
            >
                <Dialog
                    onClose={setOpen}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                >
                    <div
                        aria-hidden
                        className="fixed inset-0 z-10 bg-black/30"
                    />

                    <Dialog.Panel className="relative z-20 h-auto max-h-[calc(100vh-2*2.24rem)] w-full max-w-[min(700px,calc(100%-2rem))] overflow-auto rounded-md border border-gray-800 bg-gray-800 p-5 shadow-md shadow-gray-800 sm:p-10">
                        <Dialog.Title
                            as="h4"
                            className="mb-6 font-semibold tracking-wide text-white"
                        >
                            Add Task
                        </Dialog.Title>
                        <Formik
                            initialValues={{
                                title: '',
                                description: '',
                                dueDate: format(new Date(), 'yyyy-MM-dd'),
                                project: 'inbox',
                            }}
                            validate={validateTask}
                            onSubmit={(values, helpers) => {
                                handleCreateTask.mutate({
                                    values,
                                    helpers,
                                })
                            }}
                        >
                            {({
                                errors,
                                submitCount,
                                isSubmitting,
                                isValid,
                            }) => (
                                <Form noValidate className="space-y-3 text-sm">
                                    <div className="space-y-3">
                                        <Field
                                            type="text"
                                            name="title"
                                            autoComplete="off"
                                            autocurrect="off"
                                            className="w-full rounded border bg-white px-2 leading-8 focus:outline-none focus-visible:border-blue-300 focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                                            placeholder="Enter title..."
                                            aria-invalid={
                                                submitCount > 0 &&
                                                !!errors.title
                                            }
                                        />
                                        <Field
                                            type="text"
                                            name="description"
                                            autoComplete="off"
                                            autocurrect="off"
                                            className="w-full rounded border bg-white px-2 leading-8 focus:outline-none focus-visible:border-blue-300 focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                                            placeholder="Enter description..."
                                            aria-invalid={
                                                submitCount > 0 &&
                                                !!errors.description
                                            }
                                        />
                                    </div>
                                    <div className="flex gap-x-2 pt-4">
                                        <Field
                                            type="date"
                                            name="dueDate"
                                            autocurrect="off"
                                            autoComplete="off"
                                            autoCapitalize="none"
                                            required
                                            min={format(
                                                new Date(),
                                                'yyyy-MM-dd',
                                            )}
                                            className="rounded border bg-white px-2 leading-6 focus:outline-none focus-visible:border-blue-300 focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                                            aria-invalid={
                                                submitCount > 0 &&
                                                !!errors.dueDate
                                            }
                                        />
                                        <ProjectPicker isDialog />
                                    </div>
                                    <div className="flex justify-end gap-x-2 pt-2">
                                        <button
                                            type="button"
                                            className="rounded border border-gray-800 bg-transparent px-3 py-1.5 font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-gray-800"
                                            onClick={() => setOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded bg-skin-main px-3 py-1.5 font-semibold text-white focus:outline-none focus-visible:ring focus-visible:ring-skin-main focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:pointer-events-none disabled:opacity-50"
                                            disabled={
                                                submitCount > 0 &&
                                                (!isValid || isSubmitting)
                                            }
                                        >
                                            Submit
                                        </button>
                                    </div>
                                    {submitCount > 0 &&
                                        errorKeys.map((er) => (
                                            <ErrorMessage
                                                name={er}
                                                key={er}
                                                component="span"
                                                className="block text-skin-main before:content-['*']"
                                            />
                                        ))}
                                </Form>
                            )}
                        </Formik>
                        <button
                            type="button"
                            className="absolute top-1.5 right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-xl leading-5 text-white transition-colors hover:bg-white/10"
                            onClick={() => setOpen(false)}
                        >
                            <span>&times;</span>
                        </button>
                    </Dialog.Panel>
                </Dialog>
            </Transition>
        </Fragment>
    )
}
export default AddTaskDialog
