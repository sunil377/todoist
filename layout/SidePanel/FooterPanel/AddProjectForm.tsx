import { useAuth } from 'context/AuthContext'
import { FirebaseError } from 'firebase/app'
import { addDoc } from 'firebase/firestore'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { getProjectCollectionRef } from 'hooks/services'
import { useMutation } from 'react-query'

interface IMutationType {
    userId: string
    projectTitle: string
    helpers: FormikHelpers<{
        projectTitle: string
    }>
}

function AddProjectForm({ onClose }: { onClose: () => void }) {
    const currentUser = useAuth()

    const addProject = useMutation(
        ({ userId, projectTitle }: IMutationType) =>
            addDoc(getProjectCollectionRef(userId), {
                title: projectTitle,
            }),
        {
            onError: async (err) => {
                alert((err as FirebaseError).message)
            },
            onSuccess: () => {
                onClose()
            },
            onSettled(_data, _error, { helpers }) {
                helpers.setSubmitting(false)
            },
        },
    )

    return (
        <Formik
            initialValues={{ projectTitle: '' }}
            onSubmit={({ projectTitle }, helpers) => {
                if (!currentUser) {
                    return
                }
                addProject.mutate({
                    userId: currentUser.uid,
                    projectTitle,
                    helpers,
                })
            }}
        >
            {({ isSubmitting }) => (
                <Form noValidate className="space-y-4 divide-y">
                    <label className="flex flex-col gap-y-2 px-8 py-2">
                        <span>Name</span>
                        <Field
                            name="projectTitle"
                            type="text"
                            className="rounded-sm border px-2 py-1"
                        />
                    </label>

                    <section className="flex justify-end gap-x-2 py-2 px-8 text-xsm">
                        <button
                            type="button"
                            className="flex-shrink-0 rounded border-4 border-transparent px-2 py-1 font-medium text-gray-500 hover:text-gray-800"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded border-4 border-transparent bg-skin-main px-2 py-1 text-white hover:bg-skin-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Add Project
                        </button>
                    </section>
                </Form>
            )}
        </Formik>
    )
}

export default AddProjectForm
