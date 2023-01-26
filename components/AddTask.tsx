import { db } from '@/config/firebase'
import { FirebaseError } from 'firebase/app'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useFormik } from 'formik'
import { parseZodError } from 'helpers/util'
import isEmpty from 'lodash/isEmpty'
import InboxIcon from 'public/assets/inbox.svg'
import TodayIcon from 'public/assets/today.svg'
import { useMutation } from 'react-query'
import { z } from 'zod'

const INITIAL_VALUES = {
    title: '',
    description: '',
}

function useTask() {
    const formik = useFormik({
        initialValues: INITIAL_VALUES,
        validateOnMount: true,
        validate: validate,
        onSubmit: () => {
            mutation.mutate()
        },
    })

    const mutation = useMutation(
        () =>
            addDoc(collection(db, 'tasks'), {
                ...formik.values,
                createdAt: serverTimestamp(),
            }),
        {
            onError: (err) => {
                if (err instanceof FirebaseError) {
                    formik.setFieldError('err', err.code)
                    return
                }

                console.error('Error happen during adding Task', err)
            },

            onSuccess: (data) => {
                console.log('return taskid after adding task', data.id)
                formik.resetForm()
            },

            onSettled: () => {
                formik.setSubmitting(false)
            },
        },
    )

    return formik
}

function AddTask({ onClose }: { onClose: () => void }) {
    const {
        handleSubmit,
        errors,
        isSubmitting,
        isValid,
        touched,
        getFieldProps,
    } = useTask()

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-y-2 rounded-lg border border-gray-300 px-4 py-3 text-sm focus-within:border-gray-400">
                <input
                    type="text"
                    placeholder="Task name"
                    className="outline-none"
                    autoComplete="off"
                    autoCapitalize="none"
                    aria-invalid={!!errors.title && touched.title}
                    aria-labelledby={
                        !!errors.title && touched.title
                            ? 'task-alert'
                            : undefined
                    }
                    required
                    {...getFieldProps('title')}
                />

                <input
                    type="text"
                    placeholder="Description"
                    className="outline-none"
                    autoComplete="off"
                    autoCapitalize="none"
                    aria-invalid={!!errors.description && touched.description}
                    aria-labelledby={
                        !!errors.description && touched.description
                            ? 'task-alert'
                            : undefined
                    }
                    required
                    {...getFieldProps('description')}
                />

                <section className="mt-2 flex gap-x-2" role="group">
                    <button
                        type="button"
                        className="gap-x-1 border-green-300 px-1.5 py-0.5 text-xs font-normal text-green-700"
                    >
                        <TodayIcon aria-hidden />
                        Today
                    </button>

                    <button
                        type="button"
                        className="gap-x-1 border-blue-300 px-1.5 py-0.5 text-xsm font-normal text-blue-700"
                    >
                        <InboxIcon aria-hidden className="text-blue-500" />
                        Inbox
                    </button>
                </section>
            </div>

            <div className="mt-2 flex justify-end gap-x-3 text-xsm">
                <button
                    type="button"
                    className="bg-gray-200 px-2 py-1.5 text-gray-800"
                    onClick={onClose}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="bg-skin-dark px-2 py-1.5 text-white"
                    disabled={isSubmitting || !isValid}
                >
                    Add task
                </button>
            </div>

            {!isValid && !isEmpty(touched) && (
                <p
                    role="alert"
                    className="text-sm text-red-500"
                    id="task-alert"
                >
                    &#42;{Object.values(errors)[0]}
                </p>
            )}
        </form>
    )
}

export default AddTask

function validate<T>(values: T) {
    const response = z
        .object({
            title: z.string().min(3, 'Title should have minimun 3 characters'),
            description: z
                .string()
                .min(3, 'Description should have minimun 3 characters'),
        })
        .safeParse(values)

    return parseZodError(response)
}
