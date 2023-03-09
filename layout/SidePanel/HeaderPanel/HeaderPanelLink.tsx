import ToolTip from '@/components/Tooltip'
import clsx from 'clsx'
import NextLink, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React, { forwardRef } from 'react'

const HeaderPanelLink = forwardRef<
    HTMLAnchorElement,
    LinkProps & { children: React.ReactNode; label?: string }
>(function HeaderPanelLink(props, ref) {
    const { href, children, label, ...rest } = props
    const router = useRouter()

    const isActive = router.asPath === href

    return (
        <NextLink
            href={href}
            className={clsx(
                'tooltip relative flex w-full items-center justify-start gap-x-1.5 rounded border border-transparent px-3 py-1.5 text-sm hover:bg-blue-100 focus:outline-none focus-visible:border-blue-300 focus-visible:ring-4 focus-visible:ring-blue-100',
                { 'bg-blue-100/60': isActive },
            )}
            {...rest}
            ref={ref}
        >
            {label && (
                <ToolTip className="left-1/3 z-10 translate-x-2 after:-left-1.5 after:top-1/2 after:-translate-y-1/2 sm:left-full">
                    {label}
                </ToolTip>
            )}

            {children}
        </NextLink>
    )
})

export default HeaderPanelLink
