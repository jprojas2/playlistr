/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MainLayout from '../../layouts/MainLayout'

jest.mock('../../components/Layout/Sidebar', () => {
    return () => <div>sidebar</div>
})

jest.mock('../../components/Layout/Player', () => {
    return () => <div>player</div>
})

jest.mock('../../components/Layout/Background', () => {
    return () => <div>background</div>
})

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom')
    return {
        ...originalModule,
        Outlet: () => <div>outlet</div>
    }
})

test('renders main layout', () => {
    render(<MainLayout />)
    const layout = screen.getByRole('main')
    expect(layout).toBeInTheDocument()
})

test('renders sidebar', () => {
    render(<MainLayout />)
    const sidebar = screen.getByText(/sidebar/i)
    expect(sidebar).toBeInTheDocument()
})

test('renders player', () => {
    render(<MainLayout />)
    const player = screen.getByText(/player/i)
    expect(player).toBeInTheDocument()
})

test('renders background', () => {
    render(<MainLayout />)
    const background = screen.getByText(/background/i)
    expect(background).toBeInTheDocument()
})

test('renders outlet', () => {
    render(<MainLayout />)
    const outlet = screen.getByText(/outlet/i)
    expect(outlet).toBeInTheDocument()
})
