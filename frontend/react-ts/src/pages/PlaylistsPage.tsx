import React, { PropsWithChildren } from 'react'
import './PlaylistsPage.scss'
import axios from 'axios'
import { useModal } from '../contexts/ModalContext'
import { usePlayer } from '../contexts/PlayerContext'
import { useNavigate } from 'react-router-dom'
import SearchInput from '../components/SearchInput'
import NoSoundIcon from '../components/Icons/NoSoundIcon'
import PlaylistPlusIcon from '../components/Icons/PlaylistPlusIcon'
import CloseIcon from '../components/Icons/CloseIcon'
import CheckIcon from '../components/Icons/CheckIcon'
import TrashIcon from '../components/Icons/TrashIcon'
import PlayIcon from '../components/Icons/PlayIcon'

const PlaylistsPage: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(true)
    const [search, setSearch] = React.useState<string>('')
    const [playlists, setPlaylists] = React.useState<any[]>([])
    const { openModal, closeModal } = useModal()
    const { playPlaylist } = usePlayer()
    const Navigate = useNavigate()

    React.useEffect(() => {
        getPlaylists(() => setLoading(false))
    }, [])

    const getPlaylists = (callback?: Function) => {
        axios.get('http://localhost:3001/api/v1/playlists').then((response) => {
            setPlaylists(response.data)
            if (callback) callback()
        })
    }

    const filteredPlaylists = (): any[] => {
        return playlists.filter((playlist): boolean => {
            return playlist.name.toLowerCase().includes(search.toLowerCase())
        })
    }

    const createPlaylist = (name: string) => {
        setPlaylists([...playlists, { name, image_urls: [] }])

        axios.post('http://localhost:3001/api/v1/playlists', { playlist: { name } }).then((response) => {
            closeModal()
            getPlaylists()
        })
    }

    const deletePlaylist = (id: number) => {
        setPlaylists(playlists.filter((playlist) => playlist.id !== id))
        axios.delete(`http://localhost:3001/api/v1/playlists/${id}`).then((response) => {
            closeModal()
            getPlaylists()
        })
    }

    const NewPlaylistModal: React.FC = () => {
        const [name, setName] = React.useState<string>('')
        return (
            <div className="modal new-playlist-modal">
                <div className="modal-header">
                    <h2 className="modal-title">NEW PLAYLIST</h2>
                </div>
                <div className="modal-body">
                    <input type="text" placeholder="Name..." value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="modal-footer">
                    <div className="actions">
                        <button onClick={() => closeModal()} className="btn btn-3 cancel">
                            <div className="icon">
                                <CloseIcon />
                            </div>
                            Cancel
                        </button>
                        <button className="btn btn-3 btn-primary commit" onClick={() => createPlaylist(name)}>
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

    const DeletePlaylistModal: React.FC<{ playlist: any }> = ({ playlist }) => {
        return (
            <div className="modal new-playlist-modal">
                <div className="modal-header">
                    <h2 className="modal-title">DELETE PLAYLIST</h2>
                </div>
                <div className="modal-body">
                    <p>Are you sure you want to delete the playlist "{playlist.name}"?</p>
                </div>
                <div className="modal-footer">
                    <div className="actions">
                        <button onClick={() => closeModal()} className="btn btn-3 cancel">
                            <div className="icon">
                                <CloseIcon />
                            </div>
                            Cancel
                        </button>
                        <button className="btn btn-3 btn-primary commit" onClick={() => deletePlaylist(playlist.id)}>
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

    const NoPlaylists: React.FC = () => {
        return (
            <div className="no-playlists">
                <NoSoundIcon />
                <span>No playlists have been created</span>
                <a
                    href="#"
                    className="btn btn-2 btn-primary add-playlist-button"
                    onClick={() => {
                        openModal(<NewPlaylistModal />)
                    }}
                >
                    <span className="icon">
                        <PlaylistPlusIcon />
                    </span>
                    Create Playlist
                </a>
            </div>
        )
    }

    const NoResults: React.FC = () => {
        return (
            <div className="no-results">
                <NoSoundIcon />
                <span>No playlists found</span>
            </div>
        )
    }

    const results = (
        <>
            <div className="page-title-container">
                <h4 className="page-title">My playlists</h4>
                <a
                    href="#"
                    className="btn btn-3 btn-primary add-playlist-button"
                    onClick={() => {
                        openModal(<NewPlaylistModal />)
                    }}
                >
                    <span className="icon">
                        <PlaylistPlusIcon />
                    </span>{' '}
                    New Playlist
                </a>
            </div>
            <div className="playlist-items">
                {filteredPlaylists().map((playlist: any, index: number) => (
                    <div
                        key={index}
                        className="playlist-item"
                        onClick={() => {
                            Navigate(`/playlists/${playlist.id}`)
                        }}
                    >
                        <div className="playlist-item-left">
                            <div className="playlist-img">
                                {playlist.image_urls.length > 0 &&
                                    playlist.image_urls.map((image_url: string, index: number) => <img key={index} src={image_url} alt={playlist.name} />)}
                            </div>
                            <div className="playlist-info">
                                <span className="playlist-title">{playlist.name}</span>
                            </div>
                        </div>
                        <span className="playlist-actions">
                            <a
                                href="#"
                                className="btn btn-4 btn-danger delete-playlist"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    openModal(<DeletePlaylistModal playlist={playlist} />)
                                }}
                            >
                                <TrashIcon />
                            </a>
                            <a
                                href="#"
                                className="btn btn-4 btn-black play-playlist"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    playPlaylist(playlist.id)
                                }}
                            >
                                <PlayIcon />
                            </a>
                        </span>
                    </div>
                ))}
                {filteredPlaylists().length === 0 && <NoResults />}
            </div>
        </>
    )

    return (
        <>
            {
                <div className="playlists-page">
                    <SearchInput
                        placeholder="Search playlists..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                    />
                    {!loading && playlists.length > 0 && results}
                    {!loading && playlists.length === 0 && <NoPlaylists />}
                </div>
            }
        </>
    )
}

export default PlaylistsPage
