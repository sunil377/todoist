import { useAuth } from 'context/AuthContext'
import { startOfDay } from 'date-fns'
import { FirebaseError } from 'firebase/app'
import {
    addDoc,
    onSnapshot,
    serverTimestamp,
    updateDoc,
} from 'firebase/firestore'
import { FormikHelpers } from 'formik'
import {
    getProjectCollectionRef,
    getTaskCollectionRef,
    getTaskRef,
} from 'hooks/services'
import { IProject, ITask } from 'index'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'

type IState = Pick<ITask, 'description' | 'project' | 'title'> & {
    dueDate: string
}

type mutationType = {
    values: IState
    helpers: FormikHelpers<IState>
}

function useToCreateTask() {
    const currentUser = useAuth()

    return useMutation(
        ({ values: { dueDate, ...rest } }: mutationType) => {
            if (!currentUser) {
                return Promise.reject(new Error('Not Allowed'))
            }

            const d = startOfDay(Date.parse(dueDate)).getTime()

            const data: Omit<ITask, 'updatedAt' | 'id'> = {
                description: rest.description,
                title: rest.title,
                dueDate: d,
                createdAt: serverTimestamp(),
                project: rest.project,
                completed: false,
            }

            return addDoc(getTaskCollectionRef(currentUser.uid), data)
        },
        {
            onSuccess: (_data, { helpers: { resetForm } }) => {
                resetForm()
            },
            onError: (err, { helpers: { setFieldError } }) => {
                setFieldError('other', (err as FirebaseError | Error).message)
            },
            onSettled: (_data, _error, { helpers: { setSubmitting } }) => {
                setSubmitting(false)
            },
        },
    )
}

type updateinitialValues = Pick<ITask, 'description' | 'project' | 'title'> & {
    dueDate: string
}

type updatemutationType = {
    values: updateinitialValues
    helpers: FormikHelpers<updateinitialValues>
}

function useToUpdateTask(docId: string, onSuccess: () => void) {
    const currentUser = useAuth()

    return useMutation(
        ({ values: { dueDate, ...rest } }: updatemutationType) => {
            if (!currentUser) {
                return Promise.reject(new Error('not allowed'))
            }
            const data = {
                ...rest,
                ...(dueDate
                    ? { dueDate: startOfDay(Date.parse(dueDate)).getTime() }
                    : {}),

                updatedAt: serverTimestamp(),
            }
            return updateDoc(getTaskRef(currentUser.uid, docId), data)
        },
        {
            onSuccess: () => {
                onSuccess()
            },

            onSettled: (_data, _error, { helpers: { setSubmitting } }) => {
                setSubmitting(false)
            },
        },
    )
}

function usePicker() {
    const [query, setQuery] = useState('')
    const [tags, setTags] = useState<Array<IProject>>([])
    const currentUser = useAuth()

    const filterTags = tags.filter(({ title }) =>
        title.toLowerCase().includes(query.toLowerCase()),
    )

    useEffect(() => {
        if (!currentUser) {
            return
        }
        return onSnapshot(getProjectCollectionRef(currentUser.uid), (res) => {
            let p: Array<IProject> = []
            res.forEach((t) => {
                if (t.exists()) {
                    const result = { id: t.id, ...t.data() } as IProject
                    p = [result, ...p]
                }
            })
            setTags(p)
        })
    }, [currentUser])

    return {
        query,
        setQuery,
        filterTags,
    }
}

export { useToCreateTask, usePicker, useToUpdateTask }
