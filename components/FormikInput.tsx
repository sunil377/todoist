import { useField, useFormikContext } from 'formik'
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react'

const FormikInput = forwardRef<HTMLInputElement, Props>(function FormikInput(props, ref) {
    const { name, type = 'text', id = name, autoCapitalize = 'off', autoCorrect = 'off', required = true, ...rest } = props

    const [getFieldData, { error }] = useField(name)
    const { submitCount } = useFormikContext()

    const isInvalid = submitCount > 0 && !!error

    return (
        <input
            type={type}
            ref={ref}
            id={id}
            autoCapitalize={autoCapitalize}
            aria-invalid={isInvalid}
            required={required}
            {...rest}
            {...getFieldData}
        />
    )
})

type Input = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

interface Props extends Omit<Input, keyof Pick<Input, 'name' | 'value' | 'onBlur' | 'onChange' | 'aria-invalid'>> {
    name: string
}

export default FormikInput
