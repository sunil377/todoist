import FormikError from '@/components/Formik/FormikError'
import FormikInput from '@/components/Formik/FormikInput'
import FormikSubmitButton from '@/components/Formik/FormikSubmitButton'
import { auth } from 'config/firebase'
import FacebookAuth from 'feature/auth/FacebookAuth'
import GoogleAuth from 'feature/auth/GoogleAuth'
import { FirebaseError } from 'firebase/app'
import {
    createUserWithEmailAndPassword,
    useDeviceLanguage,
} from 'firebase/auth'
import { getDoc, setDoc } from 'firebase/firestore'
import { Form, Formik } from 'formik'
import { parseZodErrorToFormikError } from 'helpers/util'
import { getProjectRef } from 'hooks/services'
import Head from 'next/head'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import banner1 from 'public/assets/signup-banner-1.jpg'
import banner2 from 'public/assets/signup-banner-2.jpg'
import banner3 from 'public/assets/signup-banner-3.jpg'
import banner4 from 'public/assets/signup-banner-4.jpg'
import TodoSVG from 'public/assets/todo.svg'
import { useState } from 'react'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

function Signup() {
    useDeviceLanguage(auth)

    return (
        <>
            <Head>
                <title>Signup for free todoist account</title>
            </Head>

            <div className="mx-auto grid max-w-5xl lg:grid-cols-2">
                <div>
                    <main className="mx-auto max-w-md px-8">
                        <div className="inline-flex items-center gap-x-2 py-8 text-2xl">
                            <TodoSVG aria-hidden />
                            <span className="font-bold text-red-500 opacity-0 sm:opacity-100">
                                todoist
                            </span>
                        </div>

                        <div className="mt-12 pb-10">
                            <h2 className="text-3xl font-bold">Sign Up</h2>

                            {/* social site authentication */}
                            <section className="mt-10 flex flex-col gap-y-3">
                                {/* google auth */}
                                <GoogleAuth className="inline-flex items-center justify-center gap-x-2 rounded-xl border border-gray-100 p-2 text-lg font-bold hover:bg-gray-200/70 focus-visible:bg-gray-200/70" />

                                {/* fb auth */}
                                <FacebookAuth className="inline-flex items-center justify-center gap-x-2 rounded-xl border border-gray-100 p-2 text-lg font-bold hover:bg-gray-200/70 focus-visible:bg-gray-200/70" />
                            </section>

                            {/* email auth */}
                            <section className="mt-8">
                                <AuthenticationForm />
                            </section>

                            <p className="mt-4 text-xsm">
                                By continuing with Google, Apple, or Email, you
                                agree to Todoists Terms of Service and Privacy
                                Policy.
                            </p>

                            <div className="mt-6 text-center text-xsm">
                                Already signed up? &nbsp;
                                <NextLink
                                    href="/auth/login"
                                    className="rounded border-2 border-transparent p-0.5 underline focus:outline-none focus-visible:border-blue-500 focus-visible:ring focus-visible:ring-blue-100"
                                >
                                    Go to login
                                </NextLink>
                            </div>
                        </div>
                    </main>
                </div>
                <div className="hidden lg:flex lg:flex-col lg:justify-center lg:gap-y-8 lg:px-8 lg:pt-28">
                    <div className="flex justify-center">
                        <div className="space-y-4">
                            <NextImage src={banner1} alt="" />
                            <p className="flex flex-col items-center text-xsm">
                                <span className="font-bold">30 million+</span>
                                <span>apps downloads</span>
                            </p>
                        </div>
                        <div className="space-y-4">
                            <NextImage src={banner2} alt="" />
                            <p className="flex flex-col items-center text-xsm">
                                <span className="font-bold">15 year+</span>
                                <span>in business</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="space-y-4">
                            <NextImage src={banner3} alt="" />
                            <p className="flex flex-col items-center text-xsm">
                                <span className="font-bold">2 billon+</span>
                                <span>tasks completed</span>
                            </p>
                        </div>
                        <div className="space-y-4">
                            <NextImage src={banner4} alt="" />
                            <p className="flex flex-col items-center text-xsm">
                                <span className="font-bold">1 million+</span>
                                <span>pro users</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function AuthenticationForm() {
    const router = useRouter()

    const [isHidden, setHidden] = useState(true)

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
            }}
            validate={parseZodErrorToFormikError}
            onSubmit={async (
                { email, password },
                { setSubmitting, setFieldError },
            ) => {
                try {
                    const { user } = await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password,
                    )

                    const { exists } = await getDoc(
                        getProjectRef(user.uid, 'inbox'),
                    )
                    if (!exists()) {
                        await setDoc(getProjectRef(user.uid, 'inbox'), {
                            title: 'inbox',
                        })
                    }
                    router.push('/app/today')
                } catch (firebaseError) {
                    setSubmitting(false)
                    console.log(firebaseError)

                    if (firebaseError instanceof FirebaseError) {
                        setFieldError(
                            'other',
                            firebaseError.code
                                .replace(/auth\//gi, '')
                                .replace(/\-/gi, ' '),
                        )

                        alert(firebaseError.message)
                    }
                }
            }}
        >
            <Form
                noValidate
                autoCorrect="off"
                className="flex flex-col gap-y-4"
            >
                {/* Email field */}
                <div className="flex flex-col gap-y-0.5 rounded-xl border px-3 py-2 focus-within:border-gray-600">
                    <label htmlFor="email" className="text-xsm font-medium">
                        Email
                    </label>
                    <FormikInput
                        type="email"
                        name="email"
                        placeholder="Enter your email..."
                        className="bg-transparent font-bold outline-none placeholder:font-normal placeholder:text-gray-500"
                        autoComplete="username"
                        autoFocus
                    />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-y-0.5 rounded-xl border py-2 px-3 focus-within:border-gray-600">
                    <label htmlFor="password" className="text-xsm font-medium">
                        Password
                    </label>
                    <div className="flex">
                        <FormikInput
                            type={isHidden ? 'password' : 'text'}
                            name="password"
                            placeholder="Enter your password..."
                            className="w-full bg-transparent font-bold outline-none placeholder:font-normal placeholder:text-gray-500"
                            autoComplete="new-password"
                        />
                        <button
                            className="rounded-full border-0 p-0.5"
                            type="button"
                            onClick={() => setHidden((prev) => !prev)}
                        >
                            {isHidden ? (
                                <MdVisibility
                                    className="h-5 w-5"
                                    aria-label="show password"
                                />
                            ) : (
                                <MdVisibilityOff
                                    className="h-5 w-5"
                                    aria-label="hide password"
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* submit button */}

                <FormikSubmitButton className="rounded-md bg-red-500 py-2 text-xl font-bold text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    Sign up with Email
                </FormikSubmitButton>

                {/* Print Error */}
                <FormikError className="text-xsm capitalize text-red-500" />
            </Form>
        </Formik>
    )
}

export default Signup
