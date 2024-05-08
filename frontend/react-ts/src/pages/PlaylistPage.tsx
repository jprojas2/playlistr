import React from 'react'
import './PlaylistPage.scss'
import axios from 'axios'
import { useModal } from '../contexts/ModalContext'
import { usePlayer } from '../contexts/PlayerContext'
import { useNavigate, useParams } from 'react-router-dom'
import useResourceInContext from '~/hooks/resourceInContext'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import AnimatedLoading from '../components/AnimatedLoading'
import BackButton from '../components/BackButton'
import SearchInput from '../components/SearchInput'
import NoSoundIcon from '../components/Icons/NoSoundIcon'
import TrashIcon from '../components/Icons/TrashIcon'
import PlayIcon from '../components/Icons/PlayIcon'
import CheckIcon from '../components/Icons/CheckIcon'
import CloseIcon from '../components/Icons/CloseIcon'
import PauseIcon from '../components/Icons/PauseIcon'
import DragIcon from '../components/Icons/DragIcon'

interface PlaylistPageProps {
    playlistId?: string | null
    backButton?: {
        onClose: () => void
        text: string
    } | null
}

const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

const PlaylistPage: React.FC<PlaylistPageProps> = (props) => {
    const [loading, setLoading] = React.useState<boolean>(true)
    const [playlistData, setPlaylistData] = React.useState<any>(null)
    const [search, setSearch] = React.useState<string>('')
    const [loadingResults, setLoadingResults] = React.useState<boolean>(false)
    const [results, setResults] = React.useState<any[]>([])
    const { openModal, closeModal } = useModal()
    const { pause, isPlaying, playPlaylistSong } = usePlayer()
    const { id } = useParams()
    const Navigate = useNavigate()

    const getPlaylistData = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            const playlistId = props.playlistId || id
            axios
                .get(`/api/v1/playlists/${playlistId}`)
                .then((response) => {
                    setPlaylistData(response.data)
                    resolve()
                })
                .catch(reject)
        })
    }

    const { resourceInContext, setSelectedItem } = useResourceInContext(playlistData?.name, getPlaylistData)

    React.useEffect(() => {
        const playlistId = props.playlistId || id
        window.history.pushState({}, '', `/playlists/${playlistId}`)
        if (playlistData) {
            setLoading(false)
        } else {
            setLoading(true)
            getPlaylistData().then(() => {
                setLoading(false)
            })
        }
    }, [])

    React.useEffect(() => {
        const controller = new AbortController()
        if (search.length > 0) {
            setLoadingResults(true)
            axios
                .get(`/api/v1/search?q=${search}&type=song`, { signal: controller.signal })
                .then((response) => {
                    setResults(response.data)
                    setLoadingResults(false)
                })
                .catch((e) => {
                    if (e.name != 'CanceledError') {
                        throw e
                    }
                })
        }
        return () => controller.abort()
    }, [search])

    const reorderPlaylist = (songIndexes: number[]) => {
        axios.post(`/api/v1/playlists/${playlistData.id}/reorder`, { song_indexes: songIndexes }).then((response) => {
            getPlaylistData()
        })
    }

    const addSong = (songId: number) => {
        axios.post(`/api/v1/playlists/${playlistData.id}/playlist_songs`, { song_id: songId }).then((response) => {
            getPlaylistData()
        })
    }

    const deleteSong = (id: number) => {
        axios.delete(`/api/v1/playlists/${playlistData.id}/playlist_songs/${id}`).then((response) => {
            getPlaylistData().then(() => {
                closeModal()
            })
        })
    }

    const addSongItem = (songData: any) => {
        console.log(songData)
        setPlaylistData({ ...playlistData, songs: [...playlistData.songs, songData] })
        setSearch('')
        addSong(songData.eid)
    }

    const onDragEnd = (result: any) => {
        // dropped outside the list
        if (!result.destination) {
            return
        }

        const songIndexes = reorder(
            playlistData.songs.map((song: any) => song.song_index),
            result.source.index,
            result.destination.index
        )
        setPlaylistData({ ...playlistData, songs: reorder(playlistData.songs, result.source.index, result.destination.index) })
        reorderPlaylist(songIndexes)
    }

    const DeleteSongModal: React.FC<{ id: number }> = ({ id }) => {
        return (
            <div className="modal delete-song-modal">
                <div className="modal-header">
                    <h2 className="modal-title">DELETE SONG</h2>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete this song?</p>
                </div>
                <div className="modal-footer">
                    <div className="actions">
                        <button onClick={() => closeModal()} className="btn btn-3 cancel">
                            <div className="icon">
                                <CloseIcon />
                            </div>
                            Cancel
                        </button>
                        <button className="btn btn-3 btn-primary commit" onClick={() => deleteSong(id)}>
                            <div className="icon">
                                <CheckIcon />
                            </div>
                            OK
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const NoSongs: React.FC = () => {
        return (
            <div className="no-songs">
                <NoSoundIcon />
                <span>This playlist is empty. To add a song search for music in the search field.</span>
            </div>
        )
    }

    const playlistSongs = (
        <div className="playlist-songs">
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ width: '100%' }}>
                            {playlistData?.songs.map((song: any, index: number) => (
                                <Draggable key={song.eid} draggableId={song.eid} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{ marginBottom: '0.5rem', ...provided.draggableProps.style }}
                                        >
                                            {playlistSong(song, index)}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )

    const playlistSong = (song: any, index: number) => {
        return (
            <div
                key={index}
                className="playlist-song"
                onClick={() => {
                    setSelectedItem({ ...song, _type: 'song' })
                }}
            >
                <div className="playlist-song-left">
                    <div className="handle">
                        <DragIcon />
                    </div>
                    <div className="song-img">
                        <img src={song.thumbnail_url} alt={song.name} />
                    </div>
                    <div className="song-info">
                        <span className="song-title">{song.name}</span>
                    </div>
                </div>
                <span className="song-actions">
                    <a
                        href="#"
                        className="btn btn-4 btn-danger delete-song"
                        onClick={(e) => {
                            e.stopPropagation()
                            openModal(<DeleteSongModal id={song.song_index} />)
                        }}
                    >
                        <TrashIcon />
                    </a>
                    <a
                        href="#"
                        className="btn btn-4 btn-black play-song"
                        onClick={(e) => {
                            e.stopPropagation()
                            isPlaying(song.eid) ? pause() : playPlaylistSong(playlistData.id, song.song_index)
                        }}
                    >
                        {isPlaying(song.eid) ? <PauseIcon /> : <PlayIcon />}
                    </a>
                </span>
            </div>
        )
    }

    const isSongInPlaylist = (song: any): boolean => {
        return !!playlistData.songs.find((playlistSong: any) => playlistSong.eid === song.eid)
    }

    const searchResults = (
        <div className="search-results">
            {loadingResults && (
                <div className="loading-results">
                    <AnimatedLoading />
                </div>
            )}
            {!loadingResults &&
                results.map((result: any, index: number) => (
                    <div
                        key={index}
                        className={`search-result ${isSongInPlaylist(result) ? 'disabled' : ''}`}
                        onClick={(e) => {
                            if (isSongInPlaylist(result)) return
                            addSongItem(result)
                        }}
                    >
                        <div className="search-result-left">
                            <div className="search-result-img">
                                <img src={result.thumbnail_url} alt={result.title} />
                            </div>
                            <div className="search-result-info">
                                <span className="search-result-title">{result.name}</span>
                                <span className="search-result-album">{result.artist?.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
            {!loadingResults && results.length === 0 && <div className="no-results">No results found</div>}
        </div>
    )

    if (resourceInContext) return resourceInContext

    return (
        <>
            <div className="playlist-page">
                <BackButton text="Back to Playlists" />
                <div className="playlist-page-content">
                    <div className="search-music-container">
                        <SearchInput placeholder="Search music..." onChange={(e) => setSearch(e.target.value)} value={search} />
                        {search.length > 0 && searchResults}
                    </div>
                    {!loading && (
                        <>
                            <h1 className="playlist-title">{playlistData?.name}</h1>
                            {playlistData?.songs.length > 0 && playlistSongs}
                            {playlistData?.songs.length === 0 && <NoSongs />}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default PlaylistPage
