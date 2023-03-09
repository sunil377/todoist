import { db } from '@/config/firebase'
import { useAuth } from 'context/AuthContext'
import { startOfDay } from 'date-fns'
import {
    collection,
    deleteDoc,
    doc,
    DocumentData,
    onSnapshot,
    orderBy,
    query,
    QueryConstraint,
    QuerySnapshot,
    serverTimestamp,
    updateDoc,
    where,
} from 'firebase/firestore'
import { ITask } from 'index'
import { useEffect, useMemo, useState } from 'react'
import { useMutation } from 'react-query'

function useToGetAllTasks() {
    const constraint = useMemo(() => [where('completed', '==', false)], [])
    return useToGetTasksByQuery(constraint)
}

function useGetUpcomingTasks() {
    const constraint = useMemo(
        () => [
            where('dueDate', '>', startOfDay(new Date()).getTime()),
            where('completed', '==', false),
            orderBy('dueDate'),
        ],
        [],
    )
    return useToGetTasksByQuery(constraint)
}

function useToGetTasksByQuery(constraint: QueryConstraint[]) {
    const [state, setState] = useState<Array<ITask>>([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const currentUser = useAuth()

    useEffect(() => {
        if (!currentUser) return

        return onSnapshot(
            query(getTaskCollectionRef(currentUser.uid), ...constraint),
            (snapshot) => {
                const tasks = getTasksFormSnapShot(snapshot)
                setState(tasks)
                setLoading(false)
            },
            (err) => {
                alert(err.message)
                setLoading(false)
                setError(err.code)
                console.log(err.message)
            },
        )
    }, [constraint, currentUser])

    return {
        state,
        isLoading,
        error,
    }
}

function useDeleteTask() {
    const currentUser = useAuth()

    return useMutation(({ docId }: { docId: string }) => {
        if (!currentUser) {
            return Promise.reject(new Error('not Allowed'))
        }

        return deleteDoc(getTaskRef(currentUser.uid, docId))
    })
}

function useUpdateTask() {
    const currentUser = useAuth()

    return useMutation(
        ({ docId, task }: { docId: string; task: Partial<ITask> }) => {
            if (!currentUser) {
                return Promise.reject(new Error('Not Allowed'))
            }

            return updateDoc(getTaskRef(currentUser.uid, docId), {
                ...task,
                updatedAt: serverTimestamp(),
            })
        },
    )
}

function getTasksFormSnapShot(snapshot: QuerySnapshot<DocumentData>) {
    const tasks = [] as Array<ITask>
    snapshot.forEach((doc) => {
        if (doc.exists()) {
            tasks.push({ id: doc.id, ...doc.data() } as ITask)
        }
    })
    return tasks
}

function getProjectCollectionRef(userId: string) {
    return collection(db, userId, 'projects', 'projects')
}

function getTaskCollectionRef(userId: string) {
    return collection(db, userId, 'tasks', 'tasks')
}

function getProjectRef(userId: string, projectId: string) {
    return doc(db, userId, 'projects', 'projects', projectId)
}

function getTaskRef(userId: string, taskId: string) {
    return doc(db, userId, 'tasks', 'tasks', taskId)
}

export {
    useUpdateTask,
    useDeleteTask,
    useToGetAllTasks,
    useGetUpcomingTasks,
    getProjectCollectionRef,
    getProjectRef,
    getTaskRef,
    getTaskCollectionRef,
    getTasksFormSnapShot,
}
