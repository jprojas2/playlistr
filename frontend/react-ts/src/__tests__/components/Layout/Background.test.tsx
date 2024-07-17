/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Background from '../../../components/MainLayout/Background'

test('renders background', () => {
    render(<Background />)
    const backgroundIcons = screen.getAllByTitle('Album Icon')
    backgroundIcons.forEach((background) => expect(background).toBeInTheDocument())
})
