import clsx from 'clsx'
import { format, isToday, isYesterday } from 'date-fns'
import { ITask } from 'index'
import { useRouter } from 'next/router'
import { MdCalendarToday } from 'react-icons/md'

function DateDisplay({ dueDate }: Pick<ITask, 'dueDate'>) {
    const router = useRouter()
    const isTodayPage = router.pathname === '/app/today'

    if (isTodayPage && isToday(dueDate)) {
        return null
    }

    return (
        <div
            className={clsx(
                'inline-flex items-center gap-x-1 text-xs leading-6',
                isToday(dueDate) ? 'text-green-700' : 'text-skin-main',
            )}
        >
            <MdCalendarToday />
            {parseDateToLocal(dueDate)}
        </div>
    )
}

function parseDateToLocal(date: number) {
    if (isToday(date)) {
        return 'Today'
    }

    if (isYesterday(date)) {
        return 'Yesterday'
    }

    return format(new Date(date), 'EEE d MMMM')
}

export default DateDisplay
