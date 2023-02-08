import { useFormikContext } from 'formik'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

function FormikError(props: Props) {
    const { submitCount, isValid, errors } = useFormikContext()

    if (isValid || submitCount === 0) return null

    return (
        <p role="alert" {...props}>
            <>{Object.values(errors)[0]}</>
        </p>
    )
}

interface Props
    extends Omit<
        DetailedHTMLProps<
            HTMLAttributes<HTMLParagraphElement>,
            HTMLParagraphElement
        >,
        'role'
    > {}

export default FormikError
