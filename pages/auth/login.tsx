import FacebookAuth from 'feature/auth/FacebookAuth'
import { FirebaseError } from 'firebase/app'
import {
    fetchSignInMethodsForEmail,
    signInWithEmailAndPassword,
    useDeviceLanguage,
} from 'firebase/auth'
import { Form, Formik } from 'formik'
import Head from 'next/head'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaApple } from 'react-icons/fa'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import FormikError from '../../components/Formik/FormikError'
import FormikInput from '../../components/Formik/FormikInput'
import FormikSubmitButton from '../../components/Formik/FormikSubmitButton'
import { auth } from '../../config/firebase'
import GoogleAuth from '../../feature/auth/GoogleAuth'
import { parseZodErrorToFormikError } from '../../helpers/util'
import banner from '../../public/assets/banner.png'
import TodoSVG from '../../public/assets/todo.svg'

function Login() {
    useDeviceLanguage(auth)

    return (
        <>
            <Head>
                <title>Log in to Todoist</title>
            </Head>

            <div className="mx-auto grid max-w-5xl lg:grid-cols-2">
                <div>
                    <main className="mx-auto max-w-md px-8">
                        <div className="my-6 inline-flex items-center gap-x-1 text-2xl">
                            <TodoSVG aria-hidden />
                            <span className="font-bold text-red-500 opacity-0 sm:opacity-100">
                                todoist
                            </span>
                        </div>

                        <div className="pt-24 pb-10">
                            <h2 className="text-3xl font-bold">Log In</h2>

                            {/* social site authentication */}
                            <section className="mt-8 flex flex-col gap-y-3">
                                {/* google auth */}
                                <GoogleAuth className="inline-flex items-center justify-center gap-x-3 rounded-xl border border-gray-100 p-2 text-lg font-bold hover:bg-gray-200/70 focus-visible:bg-gray-200/70" />

                                {/* fb auth */}
                                <FacebookAuth className="inline-flex items-center justify-center gap-x-3 rounded-xl border border-gray-100 p-2 text-lg font-bold hover:bg-gray-200/70 focus-visible:bg-gray-200/70" />

                                {/* apple auth */}
                                <button className="inline-flex items-center justify-center gap-x-3 rounded-xl border border-gray-100 p-2 text-lg font-bold hover:bg-gray-200/70 focus-visible:bg-gray-200/70">
                                    <FaApple className="text-2xl" />
                                    Continue with Apples
                                </button>
                            </section>

                            {/* email auth */}
                            <section className="mt-8">
                                <AuthenticationForm />
                            </section>

                            <NextLink
                                href="/forgot-password"
                                className="mt-4 inline-block text-xsm text-gray-600 underline"
                            >
                                Forgot your password?
                            </NextLink>

                            <p className="mt-4 text-xsm">
                                By continuing with Google, Apple, or Email, you
                                agree to Todoists Terms of Service and Privacy
                                Policy.
                            </p>

                            <div className="mt-4 text-center text-xsm">
                                Don&apos;t have an account?&nbsp;
                                <NextLink
                                    href="/auth/signup"
                                    className="underline"
                                >
                                    Sign Up
                                </NextLink>
                            </div>
                        </div>
                    </main>
                </div>
                <div className="hidden flex-col items-center justify-center lg:flex">
                    <div>
                        <NextImage src={banner} alt="jk" className="max-w-sm" />
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
            onSubmit={async function (
                { email, password },
                { setSubmitting, setFieldError },
            ) {
                try {
                    await signInWithEmailAndPassword(auth, email, password)
                    router.push('/')
                } catch (firebaseError) {
                    setSubmitting(false)

                    if (firebaseError instanceof FirebaseError) {
                        if (firebaseError.code === 'auth/wrong-password') {
                            const method = await fetchSignInMethodsForEmail(
                                auth,
                                email,
                            )
                            if (method[0] === 'google.com') {
                                setFieldError(
                                    'other',
                                    'your email is registered as GoogleSignin. \nTry continue with google.',
                                )
                                return
                            }
                        }
                        console.log(firebaseError)
                        console.log(firebaseError.customData)

                        setFieldError(
                            'other',
                            firebaseError.code
                                .replace(/auth\//gi, '')
                                .replace(/\-/gi, ' '),
                        )
                    }
                }
            }}
        >
            <Form noValidate className="flex flex-col gap-y-4">
                {/* Email field */}
                <div className="flex flex-col gap-y-0.5 rounded-xl border px-3 py-2 focus-within:border-gray-600">
                    <label htmlFor="email" className="text-xsm font-medium">
                        Email
                    </label>
                    <FormikInput
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
                            autoComplete="current-password"
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
                <FormikSubmitButton className="rounded-md border-transparent bg-red-500 py-2 text-xl font-bold text-white hover:bg-red-600">
                    Log In
                </FormikSubmitButton>
                {/* Print Error */}
                <FormikError className="text-xsm capitalize text-red-500" />
            </Form>
        </Formik>
    )
}

export default Login
