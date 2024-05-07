import React from 'react'
import './ArtistPage.scss'
import axios from 'axios'
import SongPage from './SongPage'
import AnimatedLoading from '../components/AnimatedLoading'
import { useParams } from 'react-router-dom'

interface ArtistPageProps {
    artistId?: string | null
    artistData?: any
    backButton?: {
        onClose: () => void
        text: string
    } | null
}

const ArtistPage: React.FC<ArtistPageProps> = (props) => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingExtraData, setLoadingExtraData] = React.useState<boolean>(false)
    const [artistData, setArtistData] = React.useState<any>(null)
    const [selectedItem, setSelectedItem] = React.useState<any>(null)
    const { id } = useParams()

    React.useEffect(() => {
        const artistId = props.artistData?.id || props.artistId || id
        window.history.pushState({}, '', `/browse/artists/${artistId}`)

        setLoading(true)
        axios.get(`/api/v1/artists/${artistId}`).then((res) => {
            setArtistData(res.data)
            setLoading(false)
        })
    }, [])
    return (
        <div className="artist-page">
            {selectedItem && selectedItem._type === 'song' && (
                <SongPage
                    songId={selectedItem.eid}
                    backButton={{
                        onClose: () => {
                            setSelectedItem(null)
                            window.history.pushState({}, '', `/browse/artists/${artistData.eid}`)
                        },
                        text: `Back to ${artistData.name}`
                    }}
                />
            )}
            {!selectedItem && props.backButton && (
                <button className="btn btn-sm btn-sm-3d btn-primary back-button" onClick={props.backButton.onClose}>
                    <span>&lt;&nbsp;&nbsp;</span>
                    {props.backButton?.text || 'Back'}
                </button>
            )}
            {!selectedItem && loading && <AnimatedLoading />}
            {!selectedItem && !loading && !artistData && <div className="artist-page">Artist not found</div>}
            {!selectedItem && !loading && artistData && (
                <>
                    <div
                        className="artist-page-header"
                        style={{ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${artistData.image_url})` }}
                    >
                        <h1 className="artist-title">{artistData.name}</h1>
                    </div>
                    <div className="artist-page-content">
                        {loadingExtraData && <AnimatedLoading />}
                        {!loadingExtraData && (
                            <>
                                <p>Top Songs</p>
                                <div className="artist-top-songs">
                                    {(!artistData.top_songs || artistData.top_songs.length === 0) && <div>No songs found</div>}
                                    {artistData.top_songs?.map((song: any, index: number) => (
                                        <div
                                            key={index}
                                            className="artist-song"
                                            onClick={() => {
                                                setSelectedItem({ ...song, _type: 'song' })
                                            }}
                                        >
                                            <div className="artist-song-left">
                                                <div className="artist-song-img">
                                                    <img src={song.thumbnail_url} alt={song.name} />
                                                </div>
                                                <div className="artist-song-info">
                                                    <span className="artist-song-title">{song.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {artistData.albums && artistData.albums.length > 0 && (
                                    <>
                                        <p>Albums</p>
                                        <div className="artist-albums">
                                            {(!artistData.albums || artistData.albums.length === 0) && <div>No albums found</div>}
                                            {artistData.albums?.map((album: any, index: number) => (
                                                <div key={index} className="artist-album">
                                                    <div className="artist-album-img">
                                                        <img src={album.song_art_image_thumbnail_url} alt={album.title} />
                                                    </div>
                                                    <div className="artist-album-info">
                                                        <span className="artist-album-title">{album.title}</span>
                                                        <span className="artist-album-year">{album.year}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default ArtistPage
