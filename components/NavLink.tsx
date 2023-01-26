import { IAnchor } from 'index'
import NextLink, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'

function NavLink(props: Props) {
    const { to: href, as, legacyBehavior = true, locale, passHref, prefetch, replace, scroll, shallow, ...other } = props

    const { pathname } = useRouter()
    const isActive = pathname === href

    return (
        <NextLink
            href={href}
            as={as}
            legacyBehavior={legacyBehavior}
            locale={locale}
            passHref={passHref}
            prefetch={prefetch}
            replace={replace}
            scroll={scroll}
            shallow={shallow}
        >
            <a {...other} data-active={isActive} />
        </NextLink>
    )
}

interface Props
    extends Omit<LinkProps, keyof Pick<LinkProps, 'href' | 'onClick' | 'onMouseEnter' | 'onTouchStart'>>,
        Omit<IAnchor, keyof Pick<IAnchor, 'href'>> {
    to: LinkProps['href']
}

export default NavLink
