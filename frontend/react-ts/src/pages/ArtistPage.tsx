import React from 'react'
import './ArtistPage.scss'
import axios from 'axios'
import AnimatedLoading from '../components/AnimatedLoading'
import SongPage from './SongPage'

interface ArtistPageProps {
    artistId?: string | null
    artistData?: any
    backButton?: {
        onClose: () => void
        text: string
    } | null
}

const ArtistPage: React.FC<ArtistPageProps> = (props) => {
    const [loading, setLoading] = React.useState(false)
    const [loadingExtraData, setLoadingExtraData] = React.useState(false)
    const [artistData, setArtistData] = React.useState(props.artistData)
    const [selectedItem, setSelectedItem] = React.useState<any>(null)

    React.useEffect(() => {
        if (artistData) {
            console.log('artistData', artistData)
            setArtistData(() => {
                return {
                    eid: artistData.id,
                    name: artistData.name,
                    image_url: artistData.image_url,
                    albums: (artistData.albums || []).map((album: any) => {
                        return {
                            title: album.title,
                            year: album.year,
                            image_url: album.song_art_image_url,
                            image_thumbnail_url: album.song_art_image_thumbnail_url
                        }
                    }),
                    top_songs: (artistData.songs || []).map((song: any) => {
                        return {
                            title: song.title,
                            song_art_image_url: song.song_art_image_url,
                            song_art_image_thumbnail_url: song.song_art_image_thumbnail_url,
                            primary_artist: {
                                name: song.primary_artist.name
                            }
                        }
                    })
                }
            })
            if ((artistData.albums || []).length === 0 || (artistData.songs.length || []) === 0) {
                setLoadingExtraData(true)
                axios.get(`/api/v1/artists/${artistData.eid || artistData.id}`).then((res) => {
                    setArtistData(res.data)
                    setLoadingExtraData(false)
                })
            }
        } else if (!artistData && props.artistId) {
            setLoading(true)
            axios.get(`/api/v1/artists/${props.artistId}`).then((res) => {
                setArtistData(res.data)
                setLoading(false)
            })
        }
    }, [])
    return (
        <div className="artist-page">
            {selectedItem && selectedItem._type === 'song' && (
                <SongPage songData={selectedItem} backButton={{ onClose: () => setSelectedItem(null), text: `Back to ${artistData.name}` }} />
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
                                                setSelectedItem(song)
                                            }}
                                        >
                                            <div className="artist-song-left">
                                                <div className="artist-song-img">
                                                    <img src={song.song_art_image_thumbnail_url} alt={song.title} />
                                                </div>
                                                <div className="artist-song-info">
                                                    <span className="artist-song-title">{song.title}</span>
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
