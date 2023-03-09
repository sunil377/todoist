import { useMutation } from 'react-query'

export default function useRevalidate(route: string) {
    return useMutation(
        () =>
            fetch(
                `/api/revalidate?token=${process.env.NEXT_PUBLIC_REVALIDATE_TOKEN}&path=${route}`,
                {
                    method: 'POST',
                },
            ),
        {
            onError: () => {
                console.error(`failed to revalidate route`)
            },
            onSuccess: () => {
                console.log('revalidated route')
            },
        },
    )
}
