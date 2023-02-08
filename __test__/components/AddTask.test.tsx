import AddTask from '@/components/AddTask/AddTask'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'

const client = new QueryClient()

const handleClose = jest.fn()

describe('AddTask.tsx', () => {
    test('render snapshot', () => {
        const { container } = render(
            <>
                <QueryClientProvider client={client}>
                    <AddTask onClose={handleClose} />
                </QueryClientProvider>
            </>,
        )

        expect(container).toMatchSnapshot()
    })

    test('textfield working fine', () => {
        render(
            <QueryClientProvider client={client}>
                <AddTask onClose={handleClose} />
            </QueryClientProvider>,
        )

        const taskInput = screen.getByPlaceholderText(/task/i)
        const descriptionInput = screen.getByPlaceholderText(/description/)
    })
})
