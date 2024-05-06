import React from 'react'
import './SongPage.scss'
import PlayIcon from '../components/Icons/PlayIcon'
import PlaylistPlusIcon from '../components/Icons/PlaylistPlusIcon'
import axios from 'axios'
import HeartIcon from '../components/Icons/HeartIcon'
import EllipsisIcon from '../components/Icons/EllipsisIcon'
import AnimatedLoading from '../components/AnimatedLoading'
import { usePlayer } from '../layouts/MainLayout'
import PauseIcon from '../components/Icons/PauseIcon'

interface SongPageProps {
    songId?: string | null
    songData?: any | null
    backButton?: {
        onClose: () => void
        text: string
    } | null
}

const SongPage: React.FC<SongPageProps> = (props) => {
    const [loading, setLoading] = React.useState(false)
    const [loadingLyrics, setLoadingLyrics] = React.useState(false)
    const [songData, setSongData] = React.useState(props.songData)
    const { playSong, isPlaying, pause } = usePlayer()

    React.useEffect(() => {
        if (songData) {
            setSongData(() => {
                return {
                    eid: songData.id?.toString(),
                    name: songData.title,
                    artist_id: songData.primary_artist?.id,
                    album_id: songData.album?.id,
                    duration: 300,
                    image_url: songData.song_art_image_url,
                    image_thumbnail_url: songData.song_art_image_thumbnail_url,
                    artist: {
                        name: songData.primary_artist?.name,
                        id: songData.primary_artist?.id
                    },
                    album: {
                        title: songData.album?.title,
                        year: songData.album?.release_date
                    }
                }
            })
        } else if (!songData && props.songId) {
            setLoading(true)
            axios.get(`/api/v1/songs/${props.songId}`).then((res) => {
                setSongData(res.data)
                setLoading(false)
            })
        }
    }, [])

    React.useEffect(() => {
        if (songData && !songData.lyrics) {
            setLoadingLyrics(true)
            axios.get(`/api/v1/songs/${songData.eid}/lyrics`).then((res) => {
                setSongData((prev: any) => {
                    return {
                        ...prev,
                        lyrics: res.data.lyrics
                    }
                })
                setLoadingLyrics(false)
            })
        }
    }, [songData])

    const favorite = () => {
        axios.post(`/api/v1/songs/${songData.eid}/favorite`)
        setSongData((prev: any) => {
            return {
                ...prev,
                favorited: true
            }
        })
    }

    const unfavorite = () => {
        axios.post(`/api/v1/songs/${songData.eid}/unfavorite`).then((res) => {
            console.log(res.data)
        })
        setSongData((prev: any) => {
            return {
                ...prev,
                favorited: false
            }
        })
    }

    return (
        <>
            {loading && <AnimatedLoading />}
            {!loading && !songData && <div role="alert">No song displayed.</div>}
            {!loading && songData && (
                <div className="song-details">
                    {props.backButton && (
                        <button className="btn btn-sm btn-sm-3d btn-black back-button" onClick={props.backButton.onClose}>
                            <span>&lt;&nbsp;&nbsp;</span>
                            {props.backButton?.text || 'Back'}
                        </button>
                    )}
                    <div className="song-container">
                        <div className="song-left">
                            <div className="song-info">
                                <div className="song-title">{songData.name}</div>
                                <div className="song-artist">{songData.artist?.name}</div>
                                <div className="song-album">{songData.album?.name}</div>
                            </div>
                            <div className="lyrics-container">
                                {loadingLyrics && <AnimatedLoading />}
                                {!loadingLyrics && !songData.lyrics && <div className="no-lyrics">No lyrics found for this song</div>}
                                {!loadingLyrics && songData.lyrics && <div className="song-lyrics">{songData.lyrics}</div>}
                            </div>
                        </div>
                        <div className="song-right">
                            <div className="song-image">
                                <img src={songData.image_url} alt={songData.name} />
                            </div>
                            <div className="song-actions">
                                <div className="song-actions-row">
                                    <a
                                        className={'btn btn-2 btn-black play-button ' + (isPlaying(songData.eid) && 'playing')}
                                        href="#"
                                        onClick={() => (isPlaying(songData.eid) ? pause() : playSong(songData.eid))}
                                    >
                                        <span className="icon">
                                            <PlayIcon />
                                            <PauseIcon />
                                        </span>
                                        <span>{isPlaying(songData.eid) ? 'Pause' : 'Play'}</span>
                                    </a>
                                    <a className="btn btn-2 btn-primary more-button" href="#" target="_blank">
                                        <span className="icon">
                                            <EllipsisIcon />
                                        </span>
                                        <span></span>
                                    </a>
                                </div>
                                {songData.favorited && (
                                    <a className="btn btn-2 btn-primary unfavorite-button" href="#" onClick={unfavorite}>
                                        <span className="icon">
                                            <HeartIcon />
                                            <HeartIcon />
                                        </span>
                                        <span>Unfavorite</span>
                                    </a>
                                )}
                                {!songData.favorited && (
                                    <a className="btn btn-2 btn-primary favorite-button" href="#" onClick={favorite}>
                                        <span className="icon">
                                            <HeartIcon />
                                            <HeartIcon />
                                        </span>
                                        <span>Favorite</span>
                                    </a>
                                )}
                                <a className="btn btn-2 btn-primary playlist-button" href="#" download>
                                    <span className="icon">
                                        <PlaylistPlusIcon />
                                    </span>
                                    <span>Add to playlist</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SongPage
