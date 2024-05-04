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
    const { playerData, setPlayerData } = usePlayer()

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
            if (!songData.lyrics) {
                setLoadingLyrics(true)
                axios.get(`/api/v1/songs/${songData.eid || songData.id}/lyrics`).then((res) => {
                    setSongData((prev: any) => {
                        return {
                            ...prev,
                            lyrics: res.data.lyrics
                        }
                    })
                    setLoadingLyrics(false)
                })
            }
        } else if (!songData && props.songId) {
            setLoading(true)
            axios.get(`/api/songs/${props.songId}`).then((res) => {
                setSongData(res.data)
                setLoading(false)
            })
        }
    }, [])

    function playSong(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
        event.stopPropagation()
        axios.post(`/api/v1/songs/${songData.eid}/play`).then((res) => {
            setPlayerData(res.data)
        })
    }

    function pauseSong(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
        event.stopPropagation()
        axios.post(`/api/v1/player/pause`).then((res) => {
            setPlayerData(res.data)
        })
    }

    function isSongPlaying() {
        console.log(songData, playerData.current_song)
        return songData && songData.eid === playerData.current_song?.eid && playerData.playing
    }

    return (
        <>
            {loading && <div role="alert">Loading...</div>}
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
                                <div className="song-album">{songData.album?.title}</div>
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
                                        className={'btn btn-2 btn-black play-button ' + (isSongPlaying() && 'playing')}
                                        href="#"
                                        onClick={isSongPlaying() ? pauseSong : playSong}
                                    >
                                        <span className="icon">
                                            <PlayIcon />
                                            <PauseIcon />
                                        </span>
                                        <span>{isSongPlaying() ? 'Pause' : 'Play'}</span>
                                    </a>
                                    <a className="btn btn-2 btn-primary more-button" href="#" target="_blank">
                                        <span className="icon">
                                            <EllipsisIcon />
                                        </span>
                                        <span></span>
                                    </a>
                                </div>
                                <a className="btn btn-2 btn-primary favorite-button" href={`/api/v1/songs/${songData.eid}/favorite`} target="_blank">
                                    <span className="icon">
                                        <HeartIcon />
                                        <HeartIcon />
                                    </span>
                                    <span>Favorite</span>
                                </a>
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
