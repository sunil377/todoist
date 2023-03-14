import { format } from 'date-fns'
import { Formik } from 'formik'
import { ITask } from 'index'
import { useCallback, useRef } from 'react'
import { useToUpdateTask } from './hooks'
import TaskForm from './TaskForm'
import { validateTask } from './util'

function UpdateTask(props: { handleClose: () => void } & ITask) {
    const { handleClose, id, ...initialValues } = props

    const initialState = useRef({
        ...initialValues,
        dueDate: format(new Date(initialValues.dueDate), 'yyyy-MM-dd'),
    })

    const mutation = useToUpdateTask(
        id,
        useCallback(() => {
            handleClose()
        }, []),
    )

    return (
        <>
            <Formik
                initialValues={{
                    title: initialState.current.title,
                    description: initialState.current.description,
                    dueDate: initialState.current.dueDate,
                    project: initialState.current.project,
                }}
                validate={validateTask}
                onSubmit={({ ...values }, helpers) => {
                    mutation.mutate({
                        values,
                        helpers,
                    })
                }}
            >
                {(formikprops) => {
                    return (
                        <TaskForm
                            close={
                                <button
                                    type="button"
                                    className="flex-shrink-0 rounded border-4 border-transparent px-2 py-1 font-medium text-gray-500 hover:text-gray-800"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                            }
                            {...formikprops}
                        />
                    )
                }}
            </Formik>
        </>
    )
}

export default UpdateTask
