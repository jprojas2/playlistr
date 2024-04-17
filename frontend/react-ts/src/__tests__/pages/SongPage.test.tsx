/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import SongPage from '../../pages/SongPage'
import axios from 'axios'

jest.mock('axios')

test('renders song page', () => {
    render(<SongPage />)
    expect(screen.getByText(/no song displayed/i)).toBeInTheDocument()
})

test('renders song page with song data', () => {
    render(<SongPage songData={{ id: 1, title: 'Test Song', lyrics: 'lyrics' }} />)
    expect(screen.getByText(/Test Song/i)).toBeInTheDocument()
})

test('renders song page with songId', async () => {
    const songResponse = require('../fixtures/songs/song.json')
    axios.get = jest.fn().mockResolvedValueOnce({ data: songResponse })
    render(<SongPage songId="1" />)
    await waitFor(() => {
        expect(screen.getByText(songResponse.name)).toBeInTheDocument()
    })
})

test('fetches song lyrics if there are not any', async () => {
    const lyricsResponse = require('../fixtures/songs/lyrics.json')
    axios.get = jest.fn().mockResolvedValueOnce({ data: lyricsResponse })
    render(<SongPage songData={{ id: 1, title: 'Test Song' }} />)
    await waitFor(() => {
        expect(screen.getByText(lyricsResponse.lyrics)).toBeInTheDocument()
    })
})
