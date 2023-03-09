/* icons */
import CalenderIcon from 'public/assets/calender.svg'
import InboxIcon from 'public/assets/inbox.svg'
import TabIcon from 'public/assets/tab.svg'
import { useEffect, useRef } from 'react'
import HeaderPanelLink from './HeaderPanelLink'
import TodayIcon from './TodayIcon'

function HeaderSidePanel() {
    const firstEleRef = useRef<HTMLAnchorElement | null>(null)

    useEffect(() => {
        firstEleRef.current?.focus()
    }, [])

    return (
        <section className="w-full space-y-1.5" aria-label="page navigation">
            <HeaderPanelLink
                ref={firstEleRef}
                href="/app/project/inbox"
                label="Go To Inbox G then I"
            >
                <InboxIcon aria-hidden className="text-blue-500" />
                Inbox
            </HeaderPanelLink>

            <HeaderPanelLink href="/app/today" label="Go To Today G then T">
                <TodayIcon />
                Today
            </HeaderPanelLink>

            <HeaderPanelLink
                href="/app/upcoming"
                label="Go To Upcoming G then U"
            >
                <CalenderIcon aria-hidden className="text-purple-500" />
                Upcoming
            </HeaderPanelLink>

            <HeaderPanelLink href="/app/filter-labels">
                <TabIcon aria-hidden className="text-yellow-500" />
                Filters & Labels
            </HeaderPanelLink>
        </section>
    )
}

export default HeaderSidePanel