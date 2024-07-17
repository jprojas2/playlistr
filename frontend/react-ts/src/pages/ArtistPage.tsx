import React from 'react'
import './ArtistPage.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { usePlayer } from '../contexts/PlayerContext'
import useResourceInContext from '../hooks/resourceInContext'
import AnimatedLoading from '../components/AnimatedLoading'
import BackButton, { backButtonProps } from '../components/BackButton'
import PauseIcon from '../components/Icons/PauseIcon'
import PlayIcon from '../components/Icons/PlayIcon'

type ArtistPageProps = {
    artistId?: string | null
    artistData?: any
    backButton?: backButtonProps | null
}

const ArtistPage: React.FC<ArtistPageProps> = (props) => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingExtraData, setLoadingExtraData] = React.useState<boolean>(false)
    const [artistData, setArtistData] = React.useState<any>(props.artistData || null)
    const { id } = useParams()
    const { isPlaying, playSong, pause } = usePlayer()
    const artistId = props.artistData?.eid || props.artistId || id
    const { resourceInContext, setSelectedItem } = useResourceInContext(artistData?.name, `/browse/artists/${artistId}`)

    React.useEffect(() => {
        if (artistData) setLoadingExtraData(true)
        else setLoading(true)
        axios.get(`/api/v1/artists/${artistId}`).then((res) => {
            setArtistData(res.data)
            setLoading(false)
            setLoadingExtraData(false)
        })
    }, [])

    if (resourceInContext) return resourceInContext

    return (
        <div className="artist-page">
            {<BackButton text={props.backButton?.text || 'Back to Browse'} onClick={props.backButton?.onClick} />}
            {loading && <AnimatedLoading />}
            {!loading && !artistData && <div className="artist-page">Artist not found</div>}
            {!loading && artistData && (
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
                                            <span className="song-actions">
                                                <a
                                                    className="btn btn-4 btn-black play-song"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        isPlaying(song.eid) ? pause() : playSong(song.eid)
                                                    }}
                                                >
                                                    {isPlaying(song.eid) ? <PauseIcon /> : <PlayIcon />}
                                                </a>
                                            </span>
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
