import { format, isValid } from 'date-fns'
import { ErrorMessage, Field, Form, FormikProps } from 'formik'
import { ITask } from 'index'
import ProjectPicker from './ProjectPicker'

function TaskForm({
    isSubmitting,
    submitCount,
    errors,
    close,
}: FormikProps<
    Pick<ITask, 'title' | 'description' | 'project'> & { dueDate: string }
> & {
    close: React.ReactNode
}) {
    return (
        <Form
            noValidate
            className="divide-y rounded-lg border border-gray-200 focus-within:border-gray-400"
        >
            <div>
                <div className="flex flex-col gap-y-2  px-4 py-3 text-sm">
                    <Field
                        name="title"
                        type="text"
                        placeholder="Enter title..."
                        className="outline-none"
                        autoComplete="off"
                        autoCapitalize="none"
                        required
                        autoFocus
                        disabled={isSubmitting}
                        aria-invalid={submitCount > 0 && !!errors.title}
                    />

                    <Field
                        name="description"
                        type="text"
                        placeholder="Enter description..."
                        className="outline-none"
                        autoComplete="off"
                        autoCapitalize="none"
                        required
                        autoFocus
                        disabled={isSubmitting}
                        aria-invalid={submitCount > 0 && !!errors.description}
                    />

                    <section
                        className="mt-2 flex gap-x-2 text-xsm"
                        role="group"
                        aria-label="Add Tags"
                    >
                        <Field
                            name="dueDate"
                            type="date"
                            className="cursor-pointer rounded-sm border border-green-300 px-2 leading-6 text-green-800 focus:outline-none focus-visible:border-green-500 focus-visible:ring-2"
                            autoComplete="off"
                            autoCapitalize="none"
                            required
                            min={format(new Date(), 'yyyy-MM-dd')}
                            aria-invalid={submitCount > 0 && !!errors.dueDate}
                        />

                        <ProjectPicker />
                    </section>
                </div>
            </div>

            <div className="p-2">
                <div
                    role="alert"
                    className="bg-black text-xs capitalize leading-6 text-skin-main"
                    aria-live="polite"
                    id="task-alert"
                >
                    {submitCount > 0 &&
                        ['title', 'description', 'dueDate', 'project'].map(
                            (arg) => <ErrorMessage name={arg} key={arg} />,
                        )}
                </div>

                <div className="flex justify-end gap-x-3 text-xsm">
                    {close}

                    <button
                        disabled={submitCount > 0 && (isSubmitting || !isValid)}
                        type="submit"
                        className="rounded border-4 border-transparent bg-skin-main px-2 py-1 text-white hover:bg-skin-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        Add task
                    </button>
                </div>
            </div>
        </Form>
    )
}
export default TaskForm
