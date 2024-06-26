import React from 'react'
import './BrowsePage.scss'
import axios from 'axios'
import SongPage from './SongPage'
import ArtistPage from './ArtistPage'
import SearchInput from '../components/SearchInput'
import MicIcon from '../components/Icons/MicIcon'
import NoSoundIcon from '../components/Icons/NoSoundIcon'
import AnimatedLoading from '~/components/AnimatedLoading'

const BrowsePage: React.FC = () => {
    const [search, setSearch] = React.useState<string>('')
    const [results, setResults] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState<boolean>(false)
    const [selectedItem, setSelectedItem] = React.useState<any>(null)

    React.useEffect(() => {
        const controller = new AbortController()
        if (search.length > 0) {
            setLoading(true)
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
        return () => controller.abort()
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
                                {result._type === 'song' && <img src={result.thumbnail_url} alt={result.title} />}
                                {result._type === 'artist' && <img src={result.image_url} alt={result.title} />}
                                {result._type === 'album' && <img src={result.image_url} alt={result.title} />}
                            </div>
                            <div className="browse-item-info" data-type={result._type}>
                                {result._type === 'song' && (
                                    <>
                                        {' '}
                                        <span className="browse-item-title">{result.name}</span>
                                        <span className="browse-item-artist">{result.artist?.name}</span>
                                        <span className="browse-item-album">{result.album?.name}</span>
                                    </>
                                )}
                                {result._type === 'artist' && <span className="browse-item-title">{result.name}</span>}
                                {result._type === 'album' && (
                                    <>
                                        {' '}
                                        <span className="browse-item-album">{result.name}</span>
                                        <span className="browse-item-artist">{result.artist?.name}</span>
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

    const onBackButtonPress = () => {
        setSelectedItem(null)
        window.history.pushState(null, '', '/browse')
    }

    return (
        <>
            {selectedItem && selectedItem._type == 'song' && (
                <SongPage
                    songData={{ ...selectedItem }}
                    backButton={{
                        onClose: onBackButtonPress,
                        text: 'Back to Search'
                    }}
                />
            )}
            {selectedItem && selectedItem._type == 'artist' && (
                <ArtistPage artistData={{ ...selectedItem }} backButton={{ onClose: onBackButtonPress, text: 'Back to Search' }} />
            )}
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
                    {search.length > 0 && loading && (
                        <div className="loading-results">
                            <AnimatedLoading text="Searching..." />
                        </div>
                    )}
                    {!loading && search.length > 0 && results.length > 0 && <Results />}
                    {!loading && search.length > 0 && results.length === 0 && <NoResults />}
                </div>
            )}
        </>
    )
}

export default BrowsePage
