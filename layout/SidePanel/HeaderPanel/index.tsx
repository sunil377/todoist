import CalenderIcon from 'public/assets/calender.svg'
import InboxIcon from 'public/assets/inbox.svg'
import HeaderPanelLink from './HeaderPanelLink'
import TodayIcon from './TodayIcon'

function HeaderSidePanel() {
    return (
        <section className="w-full space-y-1.5" aria-label="page navigation">
            <HeaderPanelLink
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
        </section>
    )
}

export default HeaderSidePanel
