import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { useAuth } from 'context/AuthContext'
import { deleteDoc, getDocs, query, where } from 'firebase/firestore'
import { getProjectRef, getTaskCollectionRef, getTaskRef } from 'hooks/services'
import { IProject } from 'index'
import { MdDelete } from 'react-icons/md'
import { useMutation } from 'react-query'

function DeleteButton(arg: IProject) {
    const currentUser = useAuth()
    const deleteProject = useDeleteProject(arg)

    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    onClick={() => {
                        if (!currentUser) {
                            return
                        }
                        deleteProject.mutate({
                            uid: currentUser.uid,
                        })
                    }}
                    className={clsx('flex items-center gap-x-2.5 px-3 py-2', {
                        'text-red-500': active,
                    })}
                >
                    <MdDelete className="text-lg" />
                    <span>Delete project</span>
                </button>
            )}
        </Menu.Item>
    )
}

async function deleteProject({
    userId,
    title,
    id: docId,
}: {
    userId: string
} & IProject) {
    try {
        const projects = await getDocs(
            query(getTaskCollectionRef(userId), where('project', '==', title)),
        )

        let isError = false

        projects.forEach(async (t) => {
            try {
                await deleteDoc(getTaskRef(userId, t.id))
            } catch (error) {
                console.log(error)
                isError = true
            }
        })

        if (isError) {
            alert('Project Related task deletaion Failed.Please try again')
            return
        }

        try {
            await deleteDoc(getProjectRef(userId, docId))
        } catch (error) {
            console.log(error)
            alert('Project deletaion Failed.Please try again')
        }
    } catch (error) {
        console.log(error)
    }
}

function useDeleteProject(arg: IProject) {
    return useMutation(({ uid }: { uid: string }) =>
        deleteProject({
            userId: uid,
            ...arg,
        }),
    )
}

export default DeleteButton
