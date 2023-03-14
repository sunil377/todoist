import { parseZodError } from '@/helpers/util'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { useAuth } from 'context/AuthContext'
import { FirebaseError } from 'firebase/app'
import { addDoc } from 'firebase/firestore'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { getProjectCollectionRef } from 'hooks/services'
import { Fragment, useState } from 'react'
import { HiChevronLeft, HiPlus } from 'react-icons/hi'
import { useMutation } from 'react-query'
import { z } from 'zod'
import Projects from './Projects'

interface IMutationType {
    projectTitle: string
    helpers: FormikHelpers<{
        projectTitle: string
    }>
}

function FooterSidePanel() {
    const [isOpen, setOpen] = useState(false)
    const currentUser = useAuth()

    const addProject = useMutation(
        ({ projectTitle }: IMutationType) => {
            if (!currentUser) {
                return Promise.reject(new Error('Not Allowed'))
            }

            return addDoc(getProjectCollectionRef(currentUser.uid), {
                title: projectTitle,
            })
        },
        {
            onError: async (err) => {
                alert((err as FirebaseError).message)
            },
            onSuccess: () => {
                setOpen(false)
            },
            onSettled(_data, _error, { helpers }) {
                helpers.setSubmitting(false)
            },
        },
    )

    return (
        <Disclosure as="div">
            <div className="flex items-center gap-x-1 rounded-sm pl-3 text-sm font-semibold text-gray-600 hover:bg-gray-200">
                <div>Projects</div>
                <button
                    type="button"
                    className="ml-auto rounded border border-transparent p-2 focus:outline-none focus-visible:border-blue-300 focus-visible:ring-4 focus-visible:ring-blue-100"
                    onClick={() => setOpen(true)}
                >
                    <HiPlus aria-label="Add Project" className="text-base" />
                </button>
                <Disclosure.Button className="rounded border border-transparent p-1.5 focus:outline-none focus-visible:border-blue-300 focus-visible:ring-4 focus-visible:ring-blue-100">
                    {({ open }) => {
                        const label = open
                            ? 'hide project list'
                            : 'close project list'

                        return (
                            <HiChevronLeft
                                aria-label={label}
                                className={clsx(
                                    'text-xl transition-transform duration-300',
                                    { '-rotate-90': open },
                                )}
                            />
                        )
                    }}
                </Disclosure.Button>
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
                        <div className="fixed inset-0 bg-black/30" />

                        <Dialog.Panel className="fixed h-auto w-full max-w-[min(500px,calc(100%-2rem))] overflow-auto rounded bg-gray-800 p-5 text-sm shadow-md shadow-gray-800 sm:p-10">
                            <Dialog.Title
                                as="h4"
                                className="mb-4 font-semibold text-white"
                            >
                                Add Project
                            </Dialog.Title>

                            <Formik
                                initialValues={{ projectTitle: '' }}
                                validate={(values) => {
                                    const response = z
                                        .object({
                                            projectTitle: z.string().min(3),
                                        })
                                        .safeParse(values)

                                    return parseZodError(response)
                                }}
                                onSubmit={({ projectTitle }, helpers) => {
                                    addProject.mutate({
                                        projectTitle,
                                        helpers,
                                    })
                                }}
                            >
                                {({
                                    isSubmitting,
                                    isValid,
                                    errors,
                                    submitCount,
                                }) => (
                                    <Form noValidate>
                                        <Field
                                            type="text"
                                            name="projectTitle"
                                            autoComplete="off"
                                            autoCurrect="off"
                                            className="w-full rounded border bg-white px-2 leading-8 focus:outline-none focus-visible:border-blue-300 focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                                            placeholder="Enter title..."
                                            aria-invalid={
                                                submitCount > 0 &&
                                                !!errors.projectTitle
                                            }
                                        />

                                        <section className="mt-8 flex justify-end gap-x-2 font-semibold text-white">
                                            <button
                                                type="button"
                                                className="rounded bg-transparent px-3 py-1.5 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-gray-800"
                                                onClick={() => setOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="rounded bg-skin-main px-3 py-1.5 tracking-wide focus:outline-none focus-visible:ring focus-visible:ring-skin-main focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:pointer-events-none disabled:opacity-50"
                                                disabled={
                                                    submitCount > 0 &&
                                                    (!isValid || isSubmitting)
                                                }
                                            >
                                                Submit
                                            </button>
                                        </section>
                                    </Form>
                                )}
                            </Formik>
                            <button
                                className="absolute top-1.5 right-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-xl leading-5 text-white transition-colors hover:bg-white/10"
                                onClick={() => setOpen(false)}
                            >
                                <span>&times;</span>
                            </button>
                        </Dialog.Panel>
                    </Dialog>
                </Transition>
            </div>

            <Disclosure.Panel as="ul" className="flex flex-col gap-y-1 text-sm">
                <Projects />
            </Disclosure.Panel>
        </Disclosure>
    )
}

export default FooterSidePanel
