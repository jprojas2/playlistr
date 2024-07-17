/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Sidebar, { sidebarLinks } from '../../../components/MainLayout/Sidebar'
import { BrowserRouter as Router } from 'react-router-dom'

test('renders sidebar', () => {
    render(
        <Router>
            <Sidebar />
        </Router>
    )
    const sidebar = screen.getByText(/PLAYLISTR/i)
    expect(sidebar).toBeInTheDocument()
})

const testLinkVisible = (linkText: string) => {
    render(
        <Router>
            <Sidebar />
        </Router>
    )
    const link = screen.getByText(linkText)
    expect(link).toBeVisible()
}

const testLinkActive = (linkText: string, pathname: string) => {
    Object.defineProperty(window, 'location', {
        value: {
            pathname,
            href: `http://localhost${pathname}`,
            origin: `http://localhost${pathname}`
        },
        writable: true
    } as any)
    render(
        <Router>
            <Sidebar />
        </Router>
    )
    const link = screen.getByText(linkText).parentNode as HTMLElement
    expect(link).toHaveClass('active')
}

sidebarLinks.forEach(({ linkText, pathname }) => {
    test(`renders ${linkText} visible`, () => {
        testLinkVisible(linkText)
    })
    test(`renders ${linkText} active`, () => {
        testLinkActive(linkText, pathname)
    })
})
