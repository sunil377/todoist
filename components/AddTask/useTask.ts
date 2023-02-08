import { db } from '@/config/firebase'
import { FirebaseError } from 'firebase/app'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { FormikHelpers, useFormik } from 'formik'
import { parseZodError } from 'helpers/util'
import 'react-datepicker/dist/react-datepicker.css'
import { useMutation } from 'react-query'
import { z } from 'zod'

const INITIAL_VALUES = {
    title: '',
    description: '',
    dueDate: new Date(),
}

type mutationType = {
    values: typeof INITIAL_VALUES
    helpers: FormikHelpers<typeof INITIAL_VALUES>
}

function useTask() {
    const mutation = useMutation(
        ({ values }: mutationType) => {
            const data = {
                ...values,
                createdAt: serverTimestamp(),
            }
            return addDoc(collection(db, 'tasks'), data)
        },
        {
            onError: (err, { helpers: { setFieldError } }) => {
                if (err instanceof FirebaseError) {
                    setFieldError('err', err.code)
                    console.error(
                        'Firebase Error happen during adding Task',
                        err,
                    )
                    return
                }
                console.error('Error happen during adding Task', err)
            },

            onSuccess: (data, { helpers: { resetForm } }) => {
                console.log('return taskid after adding task', data.id)
                resetForm()
            },

            onSettled: (_data, _error, { helpers: { setSubmitting } }) => {
                setSubmitting(false)
            },
        },
    )

    return useFormik({
        initialValues: INITIAL_VALUES,
        validateOnMount: true,
        validate: validate,
        onSubmit: (values, helpers) => {
            mutation.mutate({ values, helpers })
        },
    })
}

function validate<T>(values: T) {
    const response = z
        .object({
            title: z.string().min(3, 'Title should have minimun 3 characters'),
            description: z
                .string()
                .min(3, 'Description should have minimun 3 characters'),
            dueDate: z.date(),
        })
        .safeParse(values)

    return parseZodError(response)
}

export { useTask }
