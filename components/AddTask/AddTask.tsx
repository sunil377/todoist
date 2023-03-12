import { Disclosure } from '@headlessui/react'
import { useAuth } from 'context/AuthContext'
import { format, startOfDay } from 'date-fns'
import { addDoc, serverTimestamp } from 'firebase/firestore'
import {
    ErrorMessage,
    Field,
    FieldProps,
    Form,
    Formik,
    FormikHelpers,
} from 'formik'
import { parseZodError } from 'helpers/util'
import { getTaskCollectionRef } from 'hooks/services'
import { ITask } from 'index'
import { Fragment } from 'react'
import { MdOutlineAdd } from 'react-icons/md'
import { useMutation } from 'react-query'
import { z } from 'zod'
import ProjectPicker from './ProjectPicker'

const INITIAL_VALUES = {
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    project: 'inbox',
}

type mutationType = {
    values: typeof INITIAL_VALUES
    helpers: FormikHelpers<typeof INITIAL_VALUES>
    userId: string
}

function useToCreateTask() {
    return useMutation(
        ({ values: { dueDate, ...rest }, userId }: mutationType) => {
            const d = startOfDay(Date.parse(dueDate)).getTime()
            const data: Omit<ITask, 'updatedAt' | 'id'> = {
                description: rest.description,
                title: rest.title,
                dueDate: d,
                createdAt: serverTimestamp(),
                project: rest.project,
                completed: false,
            }

            return addDoc(getTaskCollectionRef(userId), data)
        },
        {
            onSuccess: (_data, { helpers: { resetForm } }) => {
                resetForm()
            },

            onSettled: (_data, _error, { helpers: { setSubmitting } }) => {
                setSubmitting(false)
            },
        },
    )
}

function RenderComponent({ close }: { close: React.ReactNode }) {
    const currentUser = useAuth()
    const mutation = useToCreateTask()

    return (
        <>
            <Formik
                initialValues={INITIAL_VALUES}
                validate={function validate<T>(values: T) {
                    const MIN = 'should have minimun 3 characters'

                    const response = z
                        .object({
                            title: z.string().min(3, `TaskName ${MIN}`),
                            description: z
                                .string()
                                .min(3, `Description ${MIN}`),
                            dueDate: z.string(),
                            project: z.string(),
                        })
                        .safeParse(values)

                    return parseZodError(response)
                }}
                onSubmit={(values, helpers) => {
                    if (!currentUser) return
                    mutation.mutate({
                        values,
                        helpers,
                        userId: currentUser.uid,
                    })
                }}
            >
                {({ isSubmitting }) => {
                    return (
                        <Form
                            noValidate
                            className="divide-y rounded-lg border border-gray-200 focus-within:border-gray-400"
                        >
                            <div>
                                <div className="flex flex-col gap-y-2  px-4 py-3 text-sm">
                                    <Field name="title">
                                        {({ meta, field }: FieldProps) => {
                                            const isInvalid =
                                                meta.touched && !!meta.error

                                            return (
                                                <input
                                                    type="text"
                                                    placeholder="Task name"
                                                    className="outline-none"
                                                    autoComplete="off"
                                                    autoCapitalize="none"
                                                    required
                                                    autoFocus
                                                    disabled={isSubmitting}
                                                    aria-invalid={isInvalid}
                                                    aria-labelledby={
                                                        isInvalid
                                                            ? 'task-alert'
                                                            : undefined
                                                    }
                                                    {...field}
                                                />
                                            )
                                        }}
                                    </Field>

                                    <Field name="description">
                                        {({ meta, field }: FieldProps) => {
                                            const isInvalid =
                                                meta.touched && !!meta.error

                                            return (
                                                <input
                                                    type="text"
                                                    placeholder="Description"
                                                    className="outline-none"
                                                    autoComplete="off"
                                                    autoCapitalize="none"
                                                    required
                                                    disabled={isSubmitting}
                                                    aria-invalid={isInvalid}
                                                    aria-labelledby={
                                                        isInvalid
                                                            ? 'task-alert'
                                                            : undefined
                                                    }
                                                    {...field}
                                                />
                                            )
                                        }}
                                    </Field>

                                    <section
                                        className="mt-2 flex gap-x-2"
                                        role="group"
                                        aria-label="Add Tags"
                                    >
                                        <label className="relative inline-flex cursor-pointer items-center justify-center rounded-sm border border-green-300 px-1.5 py-0.5 text-green-800 focus-within:border-green-500 focus-within:ring-2">
                                            <Field name="dueDate">
                                                {({
                                                    field,
                                                }: FieldProps<any>) => (
                                                    <input
                                                        type="date"
                                                        className="focus:outline-none"
                                                        autoComplete="off"
                                                        autoCapitalize="none"
                                                        required
                                                        min={format(
                                                            new Date(),
                                                            'yyyy-MM-dd',
                                                        )}
                                                        {...field}
                                                    />
                                                )}
                                            </Field>
                                        </label>

                                        <ProjectPicker />
                                    </section>
                                </div>
                            </div>

                            <div className="p-2">
                                <div
                                    role="alert"
                                    className="text-xs capitalize leading-6 text-skin-main"
                                    aria-live="polite"
                                    id="task-alert"
                                >
                                    {['title', 'description', 'dueDate'].map(
                                        (arg) => (
                                            <ErrorMessage
                                                name={arg}
                                                key={arg}
                                            />
                                        ),
                                    )}
                                </div>

                                <div className="flex justify-end gap-x-3 text-xsm">
                                    {close}

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="rounded border-4 border-transparent bg-skin-main px-2 py-1 text-white hover:bg-skin-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        Add task
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )
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
