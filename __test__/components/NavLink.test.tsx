import NavLink from '@/components/NavLink'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { NextRouter, useRouter } from 'next/router'

jest.mock<typeof import('next/router')>('next/router', () => ({
    ...jest.requireActual('next/router'),
    useRouter: jest.fn(),
}))

const useRouterMocked = jest.mocked(useRouter)

beforeEach(() => {
    useRouterMocked.mockReset()
})

describe('NavLink.tsx', () => {
    test('home link with data-active="true" attribute', () => {
        useRouterMocked.mockImplementation(() => ({ pathname: '/' } as NextRouter))

        const { container, getByRole } = render(<NavLink to={'/'}>Home</NavLink>)

        expect(getByRole('link', { name: /home/i })).toBeInTheDocument()

        expect(useRouterMocked).toBeCalledTimes(1)

        expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          data-active="true"
          href="/"
        >
          Home
        </a>
      </div>
    `)
    })

    test('about link with data-active="true" attribute', () => {
        useRouterMocked.mockImplementation(() => ({ pathname: '/about' } as NextRouter))

        const { container, getByRole } = render(<NavLink to={'/about'}>Abouts</NavLink>)

        expect(getByRole('link', { name: /about/i })).toBeInTheDocument()
        expect(useRouterMocked).toBeCalledTimes(1)

        expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          data-active="true"
          href="/about"
        >
          Abouts
        </a>
      </div>
    `)
    })

    test('home link with data-active="false" attribute', () => {
        useRouterMocked.mockImplementation(() => ({ pathname: '/contact' } as NextRouter))

        const { container, getByRole } = render(<NavLink to={'/'}>Home</NavLink>)

        expect(getByRole('link', { name: /home/i })).toBeInTheDocument()
        expect(useRouterMocked).toBeCalledTimes(1)

        expect(container).toMatchInlineSnapshot(`
          <div>
            <a
              data-active="false"
              href="/"
            >
              Home
            </a>
          </div>
      `)
    })

    test('about link with data-active="false" attribute', () => {
        useRouterMocked.mockImplementation(() => ({ pathname: '/contact' } as NextRouter))

        const { container, getByRole } = render(<NavLink to={'/about'}>Abouts</NavLink>)

        expect(getByRole('link', { name: /about/i })).toBeInTheDocument()
        expect(useRouterMocked).toBeCalledTimes(1)

        expect(container).toMatchInlineSnapshot(`
        <div>
          <a
            data-active="false"
            href="/about"
          >
            Abouts
          </a>
        </div>
    `)
    })

    test('contact link with data-active="true" attribute', () => {
        useRouterMocked.mockImplementation(() => ({ pathname: '/contact' } as NextRouter))

        const { container, getByRole } = render(<NavLink to={'/contact'}>Contact</NavLink>)

        expect(getByRole('link', { name: /contact/i })).toBeInTheDocument()
        expect(useRouterMocked).toBeCalledTimes(1)

        expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          data-active="true"
          href="/contact"
        >
          Contact
        </a>
      </div>
    `)
    })
})

export {}
