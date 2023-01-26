import MainLayout from 'layout/MainLayout'
import { NextPageWithLayout } from 'pages/_app'

const Upcoming: NextPageWithLayout = ({ ...props }) => {
    return (
        <>
            <h1>upcoming text</h1>
        </>
    )
}

Upcoming.getLayout = (page) => {
    return <MainLayout>{page}</MainLayout>
}

export default Upcoming
