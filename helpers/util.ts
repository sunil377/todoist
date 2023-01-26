import { SafeParseReturnType, z } from 'zod'

function parseZodErrorToFormikError(values: Record<string, string>) {
    const response = z
        .object({
            email: z.string().email(),
            password: z
                .string()
                .min(6, 'Password sholud be Atleast 6 characters long.'),
        })
        .safeParse(values)

    return parseZodError(response)
}

function parseZodError<T>(response: SafeParseReturnType<T, T>) {
    if (response.success) {
        return {}
    }

    const { path, message } = response.error.errors[0]
    return { [path[0]]: message } as Partial<T>
}

export { parseZodErrorToFormikError, parseZodError }
