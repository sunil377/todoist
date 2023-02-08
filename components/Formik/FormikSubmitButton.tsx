import { useFormikContext } from 'formik'
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react'

const FormikSubmitButton = forwardRef<HTMLButtonElement, Props>(function FormikSubmitButton(props, ref) {
    const { submitCount, isValid, isSubmitting } = useFormikContext()
    const isDisabled = isSubmitting || (submitCount > 0 && !isValid)

    return <button ref={ref} disabled={isDisabled} type="submit" {...props} />
})

type Button = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

interface Props extends Omit<Button, keyof Pick<Button, 'disabled' | 'type'>> {}

export default FormikSubmitButton
