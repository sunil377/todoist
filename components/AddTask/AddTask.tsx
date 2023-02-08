import { FieldMetaProps } from 'formik'
import { IButton } from 'index'
import isEmpty from 'lodash/isEmpty'
import InboxIcon from 'public/assets/inbox.svg'
import TodayIcon from 'public/assets/today.svg'
import { forwardRef } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTask } from './useTask'

const isInvalidCarry =
    (fn: (name: string) => FieldMetaProps<any>) => (value: string) => {
        const { touched, error } = fn(value)
        return touched && !!error
    }

function AddTask({ onClose }: { onClose: () => void }) {
    const {
        handleSubmit,
        errors,
        isSubmitting,
        isValid,
        touched,
        values,
        getFieldProps,
        getFieldMeta,
        setFieldValue,
    } = useTask()

    const isInvalid = isInvalidCarry(getFieldMeta)

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-y-2 rounded-lg border border-gray-300 px-4 py-3 text-sm focus-within:border-gray-400">
                <input
                    type="text"
                    placeholder="Task name"
                    className="outline-none"
                    autoComplete="off"
                    autoCapitalize="none"
                    required
                    aria-invalid={isInvalid('title')}
                    aria-labelledby={
                        isInvalid('title') ? 'task-alert' : undefined
                    }
                    {...getFieldProps('title')}
                />

                <input
                    type="text"
                    placeholder="Description"
                    className="outline-none"
                    autoComplete="off"
                    autoCapitalize="none"
                    required
                    aria-invalid={isInvalid('description')}
                    aria-labelledby={
                        isInvalid('description') ? 'task-alert' : undefined
                    }
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

                    <ReactDatePicker
                        selected={values.dueDate}
                        onChange={(arg) => setFieldValue('dueDate', arg)}
                        className="text-red-400"
                        customInput={<CustomInputDatePicker />}
                    />

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
                <div
                    role="alert"
                    className="text-sm text-red-500 before:content-['*']"
                    id="task-alert"
                >
                    {Object.values(errors)[0] as string}
                </div>
            )}
        </form>
    )
}

const CustomInputDatePicker = forwardRef<HTMLButtonElement, IButton>(
    function CustomInputDatePicker({ value, ...props }, ref) {
        return (
            <button
                type="button"
                className="gap-x-1 border-green-300 px-1.5 py-0.5 text-xs font-normal text-green-700"
                ref={ref}
                {...props}
            >
                <TodayIcon aria-hidden />
                &nbsp;
                {value}
            </button>
        )
    },
)

export default AddTask
