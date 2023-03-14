import { useUpdateTask } from 'hooks/services'
import { ITask } from 'index'
import { MdCheck } from 'react-icons/md'

function CompletedCheckbox({
    id: docId,
    completed,
}: Pick<ITask, 'id' | 'completed'>) {
    const updateMuation = useUpdateTask()

    return (
        <button
            className="group/check mt-1.5 inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-gray-600 outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
            aria-label="task completed"
            onClick={() => {
                updateMuation.mutate({
                    docId,
                    task: { completed: true },
                })
            }}
        >
            {completed ? (
                <MdCheck aria-hidden className="text-xs text-gray-600" />
            ) : (
                <MdCheck
                    aria-hidden
                    className="invisible text-xs text-gray-600 group-hover/check:visible"
                />
            )}
        </button>
    )
}
export default CompletedCheckbox
