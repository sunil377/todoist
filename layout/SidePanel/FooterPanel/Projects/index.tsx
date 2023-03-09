import { useAuth } from 'context/AuthContext'
import { onSnapshot, query, where } from 'firebase/firestore'
import { getProjectCollectionRef } from 'hooks/services'
import { IProject } from 'index'
import { Fragment, useEffect, useState } from 'react'
import Project from './Project'

function Projects() {
    const [projects, setProjects] = useState<Array<IProject>>([])
    const currentUser = useAuth()

    useEffect(() => {
        if (!currentUser) {
            return
        }
        onSnapshot(
            query(
                getProjectCollectionRef(currentUser.uid),
                where('title', '!=', 'inbox'),
            ),
            (snapshot) => {
                let p: Array<IProject> = []
                snapshot.forEach((t) => {
                    if (t.exists()) {
                        const result = { id: t.id, ...t.data() } as IProject
                        p = [result, ...p]
                    }
                })
                setProjects(p)
            },
        )
    }, [currentUser])

    return (
        <Fragment>
            {projects.map((arg) => (
                <Project key={arg.id} {...arg} />
            ))}
        </Fragment>
    )
}
export default Projects
