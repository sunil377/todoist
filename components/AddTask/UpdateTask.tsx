import { useAuth } from 'context/AuthContext'
import { format, startOfDay } from 'date-fns'
import { serverTimestamp, updateDoc } from 'firebase/firestore'
import {
    ErrorMessage,
    Field,
    FieldProps,
    Form,
    Formik,
    FormikHelpers,
} from 'formik'
import { parseZodError } from 'helpers/util'
import { getTaskRef } from 'hooks/services'
import { ITask } from 'index'
import { useRef } from 'react'
import { FaInbox } from 'react-icons/fa'
import { MdCalendarToday } from 'react-icons/md'
import { useMutation } from 'react-query'
import { z } from 'zod'

type initialValues = Omit<
    ITask,
    keyof Pick<ITask, 'id' | 'createdAt' | 'dueDate' | 'project'>
> & {
    dueDate: string
}

type mutationType = {
    values: initialValues
    helpers: FormikHelpers<initialValues>
    currentUser: string
}

function UpdateTask(
    props: { handleClose: () => void } & Omit<
        ITask,
        keyof Pick<ITask, 'createdAt' | 'project'>
    >,
) {
    const { handleClose, id, ...initialValues } = props
    const initialState = useRef({
        ...initialValues,
        dueDate: format(new Date(initialValues.dueDate), 'yyyy-MM-dd'),
    })

    const currentUser = useAuth()

    const mutation = useMutation(
        ({ values: { dueDate, ...rest }, currentUser }: mutationType) => {
            const d = startOfDay(Date.parse(dueDate)).getTime()

            const data = {
                ...rest,
                dueDate: d,
                updatedAt: serverTimestamp(),
            }
            return updateDoc(getTaskRef(currentUser, id), data)
        },
        {
            onSuccess: () => {
                handleClose()
            },

            onSettled: (_data, _error, { helpers: { setSubmitting } }) => {
                setSubmitting(false)
            },
        },
    )

    return (
        <>
            <Formik
                initialValues={initialState.current}
                validate={function validate<T>(values: T) {
                    const MIN = 'should have minimun 3 characters'

                    const response = z
                        .object({
                            title: z.string().min(3, `Title ${MIN}`),
                            description: z
                                .string()
                                .min(3, `Description ${MIN}`),
                            dueDate: z.string(),
                        })
                        .safeParse(values)

                    return parseZodError(response)
                }}
                onSubmit={({ ...values }, helpers) => {
                    if (!currentUser) return
                    mutation.mutate({
                        values,
                        helpers,
                        currentUser: currentUser.uid,
                    })
                }}
            >
                {({ isSubmitting }) => {
                    return (
                        <Form noValidate>
                            <div className="flex flex-col gap-y-2 rounded-lg border border-gray-300 px-4 py-3 text-sm focus-within:border-gray-400">
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
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-x-1 rounded border border-green-300 px-2.5 py-1.5 text-xs font-medium text-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2"
                                    >
                                        <MdCalendarToday aria-hidden />
                                        Today
                                    </button>

                                    <label className="relative inline-flex cursor-pointer items-center justify-center rounded-sm px-1.5 py-0.5 focus-within:ring-2 focus-within:ring-blue-300">
                                        <Field name="dueDate">
                                            {({
                                                field,
                                                form: { setFieldValue },
                                            }: FieldProps) => (
                                                <input
                                                    type={'date'}
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

                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-x-1 rounded border border-blue-300 px-2.5 py-1.5 text-xs font-medium text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
                                    >
                                        <FaInbox
                                            aria-hidden
                                            className="text-base text-blue-500"
                                        />
                                        Inbox
                                    </button>
                                </section>
                            </div>

                            <div
                                role="alert"
                                className="text-xs capitalize leading-6 text-skin-main"
                                aria-live="polite"
                                id="task-alert"
                            >
                                {['title', 'description', 'dueDate'].map(
                                    (arg) => (
                                        <ErrorMessage name={arg} key={arg} />
                                    ),
                                )}
                            </div>

                            <div className="mt-2 flex justify-end gap-x-3 text-xsm">
                                <button
                                    type="button"
                                    className="rounded-sm bg-gray-300 px-3 py-1.5 font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="rounded-sm bg-skin-dark px-2 py-1.5 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Update Task
                                </button>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default UpdateTask
