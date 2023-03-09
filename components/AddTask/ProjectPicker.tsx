import { Combobox, Popover } from '@headlessui/react'
import clsx from 'clsx'
import { useAuth } from 'context/AuthContext'
import { onSnapshot } from 'firebase/firestore'
import { useField, useFormikContext } from 'formik'
import { getProjectCollectionRef } from 'hooks/services'
import { IProject } from 'index'
import { Fragment, useEffect, useState } from 'react'
import { FaInbox } from 'react-icons/fa'
import { HiChevronDown } from 'react-icons/hi'
import { MdCheck } from 'react-icons/md'

function ProjectPicker() {
    const [query, setQuery] = useState('')
    const [tags, setTags] = useState<Array<IProject>>([])
    const currentUser = useAuth()

    const filterTags = tags.filter(({ title }) =>
        title.toLowerCase().includes(query.toLowerCase()),
    )

    useEffect(() => {
        if (!currentUser) {
            return
        }
        return onSnapshot(getProjectCollectionRef(currentUser.uid), (res) => {
            let p: Array<IProject> = []
            res.forEach((t) => {
                if (t.exists()) {
                    const result = { id: t.id, ...t.data() } as IProject
                    p = [result, ...p]
                }
            })
            setTags(p)
        })
    }, [currentUser])

    const [field] = useField('project')
    const { setFieldValue } = useFormikContext()

    return (
        <Popover as="div" className="relative">
            <Popover.Button
                type="button"
                className="inline-flex items-center gap-x-1 rounded border border-blue-300 px-2.5 py-1.5 text-xs font-medium capitalize text-gray-800 focus:outline-none focus-visible:border-blue-500 focus-visible:bg-blue-100"
            >
                {field.value.toLowerCase() === 'inbox' && (
                    <FaInbox aria-hidden className="text-base text-blue-500" />
                )}
                {field.value}
                <HiChevronDown aria-label="down arrow" className="text-base" />
            </Popover.Button>

            <Popover.Panel className="absolute right-0 w-[240px] overflow-y-auto rounded-md border bg-white text-xsm">
                {({ close }) => (
                    <Combobox
                        value={field.value}
                        onChange={(e) => {
                            setFieldValue('project', e)
                            setQuery('')
                            close()
                        }}
                        name={field.name}
                    >
                        <Combobox.Input
                            onChange={(e) => setQuery(e.target.value)}
                            value={query}
                            className="w-full py-2 pl-3 pr-2 focus:outline-none"
                            autoFocus
                            placeholder="Type a project"
                        />

                        <Combobox.Options static className="border-t">
                            {filterTags.map((tag) => (
                                <Combobox.Option
                                    key={tag.id}
                                    value={tag.title}
                                    as={Fragment}
                                >
                                    {({ active, selected }) => (
                                        <li
                                            className={clsx(
                                                'flex items-center gap-x-2 py-2 px-3 capitalize',
                                                { 'bg-gray-100': active },
                                            )}
                                        >
                                            {tag.title === 'inbox' && (
                                                <FaInbox
                                                    aria-hidden
                                                    className="text-base text-blue-500"
                                                />
                                            )}
                                            {tag.title}
                                            {selected && (
                                                <MdCheck
                                                    aria-label="selected"
                                                    className="ml-auto text-blue-500"
                                                />
                                            )}
                                        </li>
                                    )}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    </Combobox>
                )}
            </Popover.Panel>
        </Popover>
    )
}
export default ProjectPicker
