import React from 'react'
import './BrowsePage.scss'
import SearchInput from '../components/SearchInput'
import MicIcon from '../components/Icons/MicIcon'
import NoSoundIcon from '../components/Icons/NoSoundIcon'
import axios from 'axios'

const BrowsePage: React.FC = () => {
    const [search, setSearch] = React.useState<string>('')
    const [results, setResults] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [selectedItem, setSelectedItem] = React.useState<any>(null)
    const currentFetchSignal = React.useRef<AbortController | null>(null)

    React.useEffect(() => {
        if (currentFetchSignal.current !== null && !currentFetchSignal.current.signal.aborted) currentFetchSignal.current.abort()
        if (search.length > 0) {
            setLoading(true)
            const controller = new AbortController()
            currentFetchSignal.current = controller
            axios
                .get('/api/v1/search?q=' + search, { signal: controller.signal })
                .then((res) => {
                    setLoading(false)
                    setResults(res.data)
                })
                .catch((e) => {
                    if (e.name != 'CanceledError') {
                        throw e
                    }
                })
        }
    }, [search])

    React.useEffect(() => {}, [selectedItem])

    const NoInput: React.FC = () => {
        return (
            <div className="no-input">
                <MicIcon />
                <span>Type something in the search field to get started</span>
            </div>
        )
    }

    const NoResults: React.FC = () => {
        return (
            <div className="no-results">
                <NoSoundIcon />
                <span>No results found</span>
            </div>
        )
    }

    const Results: React.FC = () => {
        return (
            <div className="search-results">
                {results.map((result: any, index: number) => (
                    <div
                        key={index}
                        className="browse-item-result"
                        onClick={() => {
                            setSelectedItem(result)
                        }}
                    >
                        <div className="browse-item-left">
                            <div className="browse-item-img">
                                {result._type === 'song' && <img src={result.song_art_image_thumbnail_url} alt={result.title} />}
                                {result._type === 'artist' && <img src={result.image_url} alt={result.title} />}
                                {result._type === 'album' && <img src={result.song_art_image_thumbnail_url} alt={result.title} />}
                            </div>
                            <div className="browse-item-info" data-type={result._type}>
                                {result._type === 'song' && (
                                    <>
                                        {' '}
                                        <span className="browse-item-title">{result.title}</span>
                                        <span className="browse-item-artist">{result.primary_artist.name}</span>
                                        <span className="browse-item-album"></span>
                                    </>
                                )}
                                {result._type === 'artist' && <span className="browse-item-title">{result.name}</span>}
                                {result._type === 'album' && (
                                    <>
                                        {' '}
                                        <span className="browse-item-album">{result.title}</span>
                                        <span className="browse-item-artist">{result.primary_artist.name}</span>
                                        <span className="browse-item-year">{result.year}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <span className="browse-item-type">{result._type}</span>
                    </div>
                ))}
            </div>
        )
    }

    const LoadingResults = (
        <div className="loading-results">
            <span>
                {'Searching...'.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                ))}
            </span>
        </div>
    )

    return (
        <>
            {!selectedItem && (
                <div className="browse-page-content">
                    <SearchInput
                        placeholder="Search music..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                    />
                    {search.length === 0 && <NoInput />}
                    {search.length > 0 && loading && LoadingResults}
                    {!loading && search.length > 0 && results.length > 0 && <Results />}
                    {!loading && search.length > 0 && results.length === 0 && <NoResults />}
                </div>
            )}
        </>
    )
}

export default BrowsePage
