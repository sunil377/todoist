import { IAnchor } from 'index'
import NextLink, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { forwardRef } from 'react'

const NavLink = forwardRef<HTMLAnchorElement, Props>(function NavLink(
    props,
    ref,
) {
    const { to: href, ...rest } = props

    const { pathname } = useRouter()
    const isActive = pathname === href

    return <NextLink ref={ref} href={href} data-active={isActive} {...rest} />
})

interface Props
    extends Omit<
            LinkProps,
            keyof Pick<
                LinkProps,
                'href' | 'onClick' | 'onMouseEnter' | 'onTouchStart'
            >
        >,
        Omit<IAnchor, keyof Pick<IAnchor, 'href' | 'ref'>> {
    to: LinkProps['href']
}

export default NavLink
