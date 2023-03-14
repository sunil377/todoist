import { Combobox, Popover } from '@headlessui/react'
import clsx from 'clsx'
import { useField, useFormikContext } from 'formik'
import { findColor } from 'layout/SidePanel/FooterPanel'
import { Fragment } from 'react'
import { FaInbox } from 'react-icons/fa'
import { HiChevronDown } from 'react-icons/hi'
import { MdCheck } from 'react-icons/md'
import { usePicker } from './hooks'

function ProjectPicker({ isDialog = false }) {
    const { query, setQuery, filterTags } = usePicker()

    const [field] = useField('project')
    const { setFieldValue } = useFormikContext()
    console.log(field)

    return (
        <Popover as="div" className="relative">
            <Popover.Button
                type="button"
                className={clsx(
                    'inline-flex items-center gap-x-1 rounded border border-blue-300 bg-white px-2.5 py-1.5 capitalize focus:outline-none focus-visible:border-blue-300 focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-offset-2',
                    {
                        'ring-offset-gray-800': isDialog,
                    },
                )}
            >
                {field.value.toLowerCase() === 'inbox' && (
                    <FaInbox aria-hidden className="text-base text-blue-500" />
                )}
                {field.value}
                <HiChevronDown aria-label="down arrow" className="text-base" />
            </Popover.Button>

            <Popover.Panel className="absolute right-0 top-[calc(100%+0.5rem)] w-[240px] overflow-y-auto rounded-md border bg-white text-xsm shadow-md">
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

                        <Combobox.Options static className="divide-y border-t">
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
                                            {tag.title === 'inbox' ? (
                                                <FaInbox
                                                    aria-hidden
                                                    className="text-base text-blue-500"
                                                />
                                            ) : (
                                                <span
                                                    className="inline-block h-3 w-3 rounded-full"
                                                    style={{
                                                        background: findColor(
                                                            tag.color,
                                                        ),
                                                    }}
                                                ></span>
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
