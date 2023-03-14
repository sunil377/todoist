import { parseZodError } from '@/helpers/util'
import { Dialog, Disclosure, Listbox, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { useAuth } from 'context/AuthContext'
import { FirebaseError } from 'firebase/app'
import { addDoc } from 'firebase/firestore'
import {
    ErrorMessage,
    Field,
    FieldProps,
    Form,
    Formik,
    FormikHelpers,
} from 'formik'
import { getProjectCollectionRef } from 'hooks/services'
import { IProject } from 'index'
import { Fragment, useState } from 'react'
import { HiChevronLeft, HiPlus } from 'react-icons/hi'
import { MdCheck } from 'react-icons/md'
import { useMutation } from 'react-query'
import { z } from 'zod'
import Projects from './Projects'

type project = Pick<IProject, 'color' | 'title'>
interface IMutationType extends project {
    helpers: FormikHelpers<project>
}

function FooterSidePanel() {
    const [isOpen, setOpen] = useState(false)
    const currentUser = useAuth()

    const addProject = useMutation(
        ({ title, color }: IMutationType) => {
            if (!currentUser) {
                return Promise.reject(new Error('Not Allowed'))
            }

            return addDoc(getProjectCollectionRef(currentUser.uid), {
                title,
                color,
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

                        <Dialog.Panel className="fixed flex h-full max-h-[min(550px,calc(100%-2rem))] w-full max-w-[min(500px,calc(100%-2rem))] flex-col overflow-auto rounded bg-gray-800 p-5 text-sm shadow-md shadow-gray-800 sm:p-10">
                            <Dialog.Title
                                as="h4"
                                className="mb-4 font-semibold text-white"
                            >
                                Add Project
                            </Dialog.Title>

                            <Formik
                                initialValues={{
                                    title: '',
                                    color: 'green',
                                }}
                                validate={(values) => {
                                    const response = z
                                        .object({
                                            title: z.string().min(3),
                                            color: z.string(),
                                        })
                                        .safeParse(values)

                                    return parseZodError(response)
                                }}
                                onSubmit={(values, helpers) => {
                                    addProject.mutate({
                                        helpers,
                                        ...values,
                                    })
                                }}
                            >
                                {({
                                    isSubmitting,
                                    isValid,
                                    errors,
                                    submitCount,
                                }) => (
                                    <Form
                                        noValidate
                                        className="flex basis-full flex-col"
                                    >
                                        <Field
                                            type="text"
                                            name="title"
                                            autoComplete="off"
                                            className="w-full rounded border bg-white px-2 leading-8 focus:outline-none focus-visible:border-blue-300 focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                                            placeholder="Enter title..."
                                            aria-invalid={
                                                submitCount > 0 &&
                                                !!errors.title
                                            }
                                        />

                                        <ColorPicker />

                                        {submitCount > 0 &&
                                            ['title', 'color'].map((t) => (
                                                <ErrorMessage
                                                    name={t}
                                                    key={t}
                                                    component="div"
                                                    className='mt-4 block text-skin-main before:content-["*"]'
                                                />
                                            ))}

                                        <section className="mt-auto flex justify-end gap-x-2 font-semibold text-white">
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

export const colors = [
    { name: 'black', property: '#000' },
    { name: 'yellow', property: '#eab308' },
    { name: 'lime', property: '#84cc16' },
    { name: 'green', property: '#22c55e' },
    { name: 'teal', property: '#14b8a6' },
    { name: 'indigo', property: '#6366f1' },
    { name: 'purple', property: '#a855f7' },
    { name: 'pink', property: '#ec4899' },
    { name: 'red', property: '#ef4444' },
]

export function findColor(color: string) {
    const result = colors.find((c) => c.name === color)
    return result?.property ?? '#000'
}

function ColorPicker() {
    return (
        <section className="mt-4">
            <div className="mb-2 font-semibold text-white">Color</div>
            <div className="relative">
                <Field name="color">
                    {({ field, form: { setFieldValue } }: FieldProps) => (
                        <Listbox
                            value={field.value}
                            onChange={(e) => setFieldValue('color', e)}
                        >
                            <Listbox.Button className="flex w-full items-center justify-start gap-x-2 rounded border border-gray-300 bg-white pl-3 font-medium capitalize leading-8 text-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800">
                                <span
                                    className="inline-block h-3 w-3 rounded-full"
                                    style={{
                                        background: findColor(field.value),
                                    }}
                                ></span>
                                {field.value}
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 h-auto w-full overflow-auto rounded-md border border-gray-300 bg-white shadow shadow-gray-300 focus:outline-none">
                                {colors.map((c) => (
                                    <Listbox.Option
                                        key={c.name}
                                        value={c.name}
                                        as={Fragment}
                                    >
                                        {({ active, selected }) => (
                                            <li
                                                className={clsx(
                                                    'flex w-full cursor-pointer items-center justify-start gap-x-3 py-1 pl-3 capitalize',
                                                    {
                                                        'bg-gray-200': active,
                                                    },
                                                )}
                                            >
                                                <span
                                                    className="inline-block h-3 w-3 rounded-full"
                                                    style={{
                                                        background: c.property,
                                                    }}
                                                ></span>
                                                <span
                                                    style={{
                                                        color: c.property,
                                                    }}
                                                >
                                                    {c.name}
                                                </span>
                                                {selected && (
                                                    <MdCheck className="ml-auto text-xl text-blue-500" />
                                                )}
                                            </li>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Listbox>
                    )}
                </Field>
            </div>
        </section>
    )
}

export default FooterSidePanel
