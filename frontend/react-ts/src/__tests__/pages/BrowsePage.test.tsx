/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BrowsePage from '../../pages/BrowsePage'
import axios from 'axios'

test('renders browse page', () => {
    render(<BrowsePage />)
    const browsePage = screen.getByText(/Type something in the search field to get started/i)
    expect(browsePage).toBeInTheDocument()
})

test('renders search field', () => {
    render(<BrowsePage />)
    const searchField = screen.getByPlaceholderText(/Search music.../i)
    expect(searchField).toBeInTheDocument()
})

jest.mock('axios')

test('renders no results', async () => {
    axios.get = jest.fn().mockResolvedValueOnce({ data: require('../fixtures/search/empty_results.json') })
    render(<BrowsePage />)
    const searchField = screen.getByPlaceholderText(/Search music.../i)
    fireEvent.change(searchField, { target: { value: 'asdf' } })
    await waitFor(() => {
        const noResults = screen.getByText(/No results found/i)
        expect(noResults).toBeInTheDocument()
    })
})

test('renders search results', async () => {
    axios.get = jest.fn().mockResolvedValueOnce({ data: require('../fixtures/search/results.json') })
    render(<BrowsePage />)
    const searchField = screen.getByPlaceholderText(/Search music.../i)
    fireEvent.change(searchField, { target: { value: 'asdf' } })
    await waitFor(() => {
        const results = screen.getAllByText(/song/i)
        expect(results.length).toBe(2)
    })
})
