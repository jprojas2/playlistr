import React from 'react'
import './AddToPlaylistModal.scss'
import axios from 'axios'
import AnimatedLoading from '../AnimatedLoading'
import PlaylistPlusIcon from '../Icons/PlaylistPlusIcon'
import CloseIcon from '../Icons/CloseIcon'
import CheckIcon from '../Icons/CheckIcon'

type AddToPlaylistModalProps = {
    song: any
    closeModal: () => void
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ song, closeModal }) => {
    const [loading, setLoading] = React.useState(true)
    const [playlists, setPlaylists] = React.useState<any>([])
    React.useEffect(() => {
        axios.get('/api/v1/playlists').then((res) => {
            setPlaylists(res.data)
            setLoading(false)
        })
    }, [])

    const addSongToPlaylist = (songId: string, playlistId: string) => {
        axios.post(`http://localhost:3001/api/v1/playlists/${playlistId}/playlist_songs`, { song_id: songId })
    }

    const removeSongFromPlaylist = (songId: string, playlistId: string) => {
        axios.post(`http://localhost:3001/api/v1/playlists/${playlistId}/remove_song`, { song_id: songId })
    }

    const songInPlaylist = (playlist: any) => {
        return playlist.song_eids.find((eid: string) => eid === song.eid)
    }

    return (
        <div className="modal add-to-playlist-modal">
            <div className="modal-header">
                <h2 className="modal-title">ADD TO PLAYLIST</h2>
            </div>
            <div className="modal-body">
                {loading && <AnimatedLoading />}
                {!loading && (
                    <div className="playlists">
                        {playlists.map((playlist: any) => {
                            return (
                                <div className="playlist">
                                    <span className="playlist-name">{playlist.name}</span>
                                    {songInPlaylist(playlist) ? (
                                        <a
                                            href="#"
                                            className="btn btn-3 btn-danger remove-from-playlist"
                                            onClick={(e) => {
                                                removeSongFromPlaylist(song.id, playlist.id)
                                                closeModal()
                                            }}
                                        >
                                            <span className="icon">
                                                <CloseIcon />
                                            </span>
                                            Remove
                                        </a>
                                    ) : (
                                        <a
                                            href="#"
                                            className="btn btn-3 btn-primary add-to-playlist"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                addSongToPlaylist(song.eid, playlist.id)
                                                closeModal()
                                            }}
                                        >
                                            <span className="icon">
                                                <PlaylistPlusIcon />
                                            </span>
                                            Add
                                        </a>
                                    )}
                                </div>
                            )
                        })}
                        {playlists.length == 0 && <div className="no-playlists">There are no playlists</div>}
                    </div>
                )}
            </div>
            <div className="modal-footer">
                <div className="actions">
                    <button onClick={() => closeModal()} className="btn btn-3 cancel">
                        <div className="icon">
                            <CloseIcon />
                        </div>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddToPlaylistModal
