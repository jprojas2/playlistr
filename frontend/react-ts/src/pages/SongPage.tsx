import React from 'react'
import './SongPage.scss'
import axios from 'axios'
import { usePlayer } from '../contexts/PlayerContext'
import { useParams } from 'react-router-dom'
import AnimatedLoading from '../components/AnimatedLoading'
import PlayIcon from '../components/Icons/PlayIcon'
import PlaylistPlusIcon from '../components/Icons/PlaylistPlusIcon'
import HeartIcon from '../components/Icons/HeartIcon'
import EllipsisIcon from '../components/Icons/EllipsisIcon'
import PauseIcon from '../components/Icons/PauseIcon'
import useResourceInContext from '../hooks/resourceInContext'
import BackButton, { backButtonProps } from '../components/BackButton'
import OptionsModal from '../components/OptionsModal'
import AddToPlaylistModal from '../components/SongPage/AddToPlaylistModal'
import { useModal } from '../contexts/ModalContext'

type SongPageProps = {
    songId?: string | null
    songData?: any
    backButton?: backButtonProps | null
}

const SongPage: React.FC<SongPageProps> = (props) => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const [loadingLyrics, setLoadingLyrics] = React.useState<boolean>(false)
    const [songData, setSongData] = React.useState<any>(props.songData || null)
    const { playSong, playSongNext, addSongToQueue, isPlaying, pause } = usePlayer()
    const { id } = useParams()
    const songId = props.songData?.eid || props.songId || id
    const { resourceInContext, setSelectedItem } = useResourceInContext(songData?.name, `/browse/songs/${songId}`)
    const { openModal, closeModal } = useModal()

    React.useEffect(() => {
        if (!songData) setLoading(true)
        axios.get(`/api/v1/songs/${songId}`).then((res) => {
            setSongData(res.data)
            setLoading(false)
        })
    }, [])

    React.useEffect(() => {
        if (songData?.eid && !songData.lyrics) {
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
        axios.post(`/api/v1/songs/${songData.eid}/unfavorite`)
        setSongData((prev: any) => {
            return {
                ...prev,
                favorited: false
            }
        })
    }

    if (resourceInContext) return resourceInContext

    return (
        <div className="song-page">
            <BackButton text={props.backButton?.text || 'Back to Browse'} onClick={props.backButton?.onClick} color="black" />
            {loading && <AnimatedLoading />}
            {!loading && !songData && <div role="alert">No song displayed.</div>}
            {!loading && songData && (
                <div className="song-container">
                    <div className="song-left">
                        <div className="song-info">
                            <div className="song-title">{songData.name}</div>
                            {songData?.artist && (
                                <a href="#" className="song-artist" onClick={() => setSelectedItem({ ...songData.artist, _type: 'artist' })}>
                                    {songData.artist?.name}
                                </a>
                            )}
                            {songData?.album && (
                                <a href="#" className="song-album" onClick={() => setSelectedItem({ ...songData.album, _type: 'album' })}>
                                    {songData.album?.name}
                                </a>
                            )}
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
                                    onClick={(e) => {
                                        e.preventDefault()
                                        isPlaying(songData.eid) ? pause() : playSong(songData.eid)
                                    }}
                                >
                                    <span className="icon">
                                        <PlayIcon />
                                        <PauseIcon />
                                    </span>
                                    <span>{isPlaying(songData.eid) ? 'Pause' : 'Play'}</span>
                                </a>
                                <a
                                    className="btn btn-2 btn-primary more-button"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        openModal(
                                            <OptionsModal
                                                options={[
                                                    {
                                                        name: 'Play',
                                                        onClick: () => {
                                                            playSong(songData.eid)
                                                            closeModal()
                                                        }
                                                    },
                                                    {
                                                        name: 'Play next',
                                                        onClick: () => {
                                                            playSongNext(songData.eid)
                                                            closeModal()
                                                        }
                                                    },
                                                    {
                                                        name: 'Add to queue',
                                                        onClick: () => {
                                                            addSongToQueue(songData.eid)
                                                            closeModal()
                                                        }
                                                    }
                                                ]}
                                                closeModal={closeModal}
                                            />
                                        )
                                    }}
                                >
                                    <span className="icon">
                                        <EllipsisIcon />
                                    </span>
                                    <span></span>
                                </a>
                            </div>
                            {songData.favorited && (
                                <a
                                    className="btn btn-2 btn-primary unfavorite-button"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        unfavorite()
                                    }}
                                >
                                    <span className="icon">
                                        <HeartIcon />
                                        <HeartIcon />
                                    </span>
                                    <span>Unfavorite</span>
                                </a>
                            )}
                            {!songData.favorited && (
                                <a
                                    className="btn btn-2 btn-primary favorite-button"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        favorite()
                                    }}
                                >
                                    <span className="icon">
                                        <HeartIcon />
                                        <HeartIcon />
                                    </span>
                                    <span>Favorite</span>
                                </a>
                            )}
                            <a
                                className="btn btn-2 btn-primary playlist-button"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    openModal(<AddToPlaylistModal song={songData} closeModal={closeModal} />)
                                }}
                            >
                                <span className="icon">
                                    <PlaylistPlusIcon />
                                </span>
                                <span>Add to playlist</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SongPage
