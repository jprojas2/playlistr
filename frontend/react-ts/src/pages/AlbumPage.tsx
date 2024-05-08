import React from 'react'
import './AlbumPage.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { usePlayer } from '../contexts/PlayerContext'
import useResourceInContext from '../hooks/resourceInContext'
import BackButton, { backButtonProps } from '../components/BackButton'
import AnimatedLoading from '~/components/AnimatedLoading'
import PauseIcon from '../components/Icons/PauseIcon'
import PlayIcon from '../components/Icons/PlayIcon'

type AlbumPageProps = {
    albumId?: string | null
    albumData?: any
    backButton?: backButtonProps
}

const AlbumPage: React.FC<AlbumPageProps> = (props) => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingExtraData, setLoadingExtraData] = React.useState<boolean>(false)
    const [albumData, setAlbumData] = React.useState<any>(props.albumData || null)
    const { id } = useParams()
    const { isPlaying, playSong, pause, playlistData } = usePlayer()
    const { resourceInContext, setSelectedItem } = useResourceInContext(albumData?.name)

    React.useEffect(() => {
        const albumId = props.albumData?.eid || props.albumId || id
        if (window.location.href.includes('/browse')) window.history.pushState({}, '', `/browse/albums/${albumId}`)
        if (albumData) setLoadingExtraData(true)
        else setLoading(true)
        setLoading(true)
        axios.get(`/api/v1/albums/${albumId}`).then((res) => {
            setAlbumData(res.data)
            setLoading(false)
            setLoadingExtraData(false)
        })
    }, [])

    if (resourceInContext) return resourceInContext

    return (
        <div className="album-page">
            <BackButton text={props.backButton?.text || 'Back to Browse'} onClick={props.backButton?.onClick} />
            {loading && <AnimatedLoading />}
            {!loading && !albumData && <div className="album-page">Album not found</div>}
            {!loading && albumData && (
                <>
                    <div
                        className="album-page-header"
                        style={{ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${albumData.image_url})` }}
                    >
                        <h1 className="album-title">{albumData.name}</h1>
                    </div>
                    <div className="album-page-content">
                        {loadingExtraData && <AnimatedLoading />}
                        {!loadingExtraData && (
                            <>
                                <div className="album-songs-title">Songs</div>
                                <div className="album-songs">
                                    {albumData.songs?.map((song: any, index: number) => (
                                        <div
                                            key={index}
                                            className="album-song"
                                            onClick={() => {
                                                setSelectedItem({ ...song, _type: 'song' })
                                            }}
                                        >
                                            <div className="album-song-left">
                                                <div className="album-song-img">
                                                    <img src={song.thumbnail_url} alt={song.name} />
                                                </div>
                                                <div className="album-song-info">
                                                    <span className="album-song-title">{song.name}</span>
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
                                    {(!albumData.songs || albumData.songs.length === 0) && <div>No songs found</div>}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default AlbumPage
