import { parseZodError } from '@/helpers/util'
import { z } from 'zod'

const MIN = 'should have minimun 3 characters'

function validateTask<T>(values: T) {
    const response = z
        .object({
            title: z.string().min(3, `Title ${MIN}`),
            description: z.string().min(3, `Description ${MIN}`),
            dueDate: z.string(),
            project: z.string().min(3),
        })
        .safeParse(values)

    return parseZodError(response)
}

export { validateTask }
