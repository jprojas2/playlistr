import React from 'react'
import './PlaylistPage.scss'
import axios from 'axios'
import SearchInput from '../components/SearchInput'
import NoSoundIcon from '../components/Icons/NoSoundIcon'
import TrashIcon from '../components/Icons/TrashIcon'
import PlayIcon from '../components/Icons/PlayIcon'
import CheckIcon from '../components/Icons/CheckIcon'
import CloseIcon from '../components/Icons/CloseIcon'
import { useModal } from '../contexts/ModalContext'
import { usePlayer } from '../layouts/MainLayout'
import PauseIcon from '../components/Icons/PauseIcon'
import AnimatedLoading from '~/components/AnimatedLoading'
import DragIcon from '~/components/Icons/DragIcon'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { get } from 'http'

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
    const currentFetchSignal = React.useRef<AbortController | null>(null)

    React.useEffect(() => {
        if (playlistData) {
            setLoading(false)
        } else {
            setLoading(true)
            getPlaylistData(() => {
                setLoading(false)
            })
        }
    }, [playlistData])

    React.useEffect(() => {
        if (search.length > 0) {
            getSearchResults()
        }
    }, [search])

    const getPlaylistData = (callback?: Function) => {
        axios.get(`/api/v1/playlists/${props.playlistId}`).then((response) => {
            setPlaylistData(response.data)
            if (callback) callback()
        })
    }

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
            getPlaylistData(() => {
                closeModal()
            })
        })
    }

    const addSongItem = (songData: any) => {
        const song = {
            eid: songData.id,
            name: songData.title,
            image_url: songData.song_art_image_thumbnail_url,
            song_index: playlistData.songs.length
        }
        setPlaylistData({ ...playlistData, songs: [...playlistData.songs, song] })
        setSearch('')
        addSong(songData.id)
    }

    const getSearchResults = () => {
        if (currentFetchSignal.current !== null && !currentFetchSignal.current.signal.aborted) currentFetchSignal.current.abort()
        const controller = new AbortController()
        currentFetchSignal.current = controller
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
                    //setSelectedItem(playlist)
                }}
            >
                <div className="playlist-song-left">
                    <div className="handle">
                        <DragIcon />
                    </div>
                    <div className="song-img">
                        <img src={song.image_url} alt={song.name} />
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
                            openModal(<DeleteSongModal id={song.song_index} />)
                        }}
                    >
                        <TrashIcon />
                    </a>
                    <a
                        href="#"
                        className="btn btn-4 btn-black play-song"
                        onClick={(e) => {
                            isPlaying(song.eid) ? pause() : playPlaylistSong(playlistData.id, song.song_index)
                        }}
                    >
                        {isPlaying(song.eid) ? <PauseIcon /> : <PlayIcon />}
                    </a>
                </span>
            </div>
        )
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
                        className="search-result"
                        onClick={() => {
                            addSongItem(result)
                        }}
                    >
                        <div className="search-result-left">
                            <div className="search-result-img">
                                <img src={result.song_art_image_thumbnail_url} alt={result.title} />
                            </div>
                            <div className="search-result-info">
                                <span className="search-result-title">{result.title}</span>
                                <span className="search-result-album">{result.primary_artist?.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
            {!loadingResults && results.length === 0 && <div className="no-results">No results found</div>}
        </div>
    )

    return (
        <div className="playlist-page">
            {props.backButton && (
                <button className="btn btn-sm btn-sm-3d btn-primary back-button" onClick={props.backButton.onClose}>
                    <span>&lt;&nbsp;&nbsp;</span>
                    {props.backButton?.text || 'Back'}
                </button>
            )}
            {loading && <div className="">loading</div>}
            {!loading && (
                <div className="playlist-page-content">
                    <h1 className="playlist-title">{playlistData?.name}</h1>
                    <div className="search-music-container">
                        <SearchInput placeholder="Search music..." onChange={(e) => setSearch(e.target.value)} value={search} />
                        {search.length > 0 && searchResults}
                    </div>
                    {playlistData?.songs.length > 0 && playlistSongs}
                    {playlistData?.songs.length === 0 && <NoSongs />}
                </div>
            )}
        </div>
    )
}

export default PlaylistPage
