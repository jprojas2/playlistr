import React from 'react'
import './FavoritesPage.scss'
import axios from 'axios'
import { useModal } from '../contexts/ModalContext'
import { usePlayer } from '../contexts/PlayerContext'
import useResourceInContext from '../hooks/resourceInContext'
import SearchInput from '../components/SearchInput'
import TrashIcon from '../components/Icons/TrashIcon'
import PlayIcon from '../components/Icons/PlayIcon'
import PauseIcon from '../components/Icons/PauseIcon'
import CloseIcon from '../components/Icons/CloseIcon'
import CheckIcon from '../components/Icons/CheckIcon'
import BrokenHeartIcon from '../components/Icons/BrokenHeartIcon'

const FavoritesPage = () => {
    const [loading, setLoading] = React.useState<boolean>(true)
    const [search, setSearch] = React.useState<string>('')
    const [favorites, setFavorites] = React.useState<any[]>([])
    const { openModal, closeModal } = useModal()
    const { playSong, isPlaying, pause } = usePlayer()

    const getFavorites = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            axios
                .get('http://localhost:3001/api/v1/favorites')
                .then((response) => {
                    setFavorites(response.data)
                    resolve()
                })
                .catch(reject)
        })
    }

    const { resourceInContext, setSelectedItem } = useResourceInContext('Favorites', getFavorites)

    React.useEffect(() => {
        getFavorites().then(() => setLoading(false))
    }, [])

    const filteredFavorites = (): any[] => {
        return favorites.filter((favorite): boolean => {
            return favorite.song.name.toLowerCase().includes(search.toLowerCase())
        })
    }

    const unfavorite = (id: number) => {
        axios.delete(`http://localhost:3001/api/v1/favorites/${id}`).then((response) => {
            setFavorites(favorites.filter((favorite) => favorite.id !== id))
            closeModal()
        })
    }

    const DeleteFavoriteModal: React.FC<{ id: number }> = ({ id }) => {
        return (
            <div className="modal new-playlist-modal">
                <div className="modal-header">
                    <h2 className="modal-title">REMOVE FAVORITE</h2>
                </div>
                <div className="modal-body">
                    <p>Remove this song from your favorites?</p>
                </div>
                <div className="modal-footer">
                    <div className="actions">
                        <button onClick={() => closeModal()} className="btn btn-3 cancel">
                            <div className="icon">
                                <CloseIcon />
                            </div>
                            Cancel
                        </button>
                        <button className="btn btn-3 btn-primary commit" onClick={() => unfavorite(id)}>
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
    const NoFavorites = (
        <div className="no-favorites">
            <BrokenHeartIcon />
            <span>No favorites have been saved yet</span>
        </div>
    )

    const NoResults = (
        <div className="no-results">
            <BrokenHeartIcon />
            <span>No favorites found</span>
        </div>
    )

    const results = (
        <div className="favorites">
            {filteredFavorites().map((favorite) => (
                <div key={favorite.id} className="favorite" onClick={() => setSelectedItem({ ...favorite.song, _type: 'song' })}>
                    <div className="favorite-left">
                        <div className="favorite-img">
                            <img src={favorite.song.image_url} alt={favorite.song.name} />
                        </div>
                        <div className="favorite-info">
                            <div className="favorite-title">{favorite.song.name}</div>
                            <div className="favorite-artist">{favorite.song.artist.name}</div>
                        </div>
                    </div>
                    <span className="favorite-actions">
                        <a
                            href="#"
                            className="btn btn-4 btn-danger delete-song"
                            onClick={(e) => {
                                e.stopPropagation()
                                openModal(<DeleteFavoriteModal id={favorite.id} />)
                            }}
                        >
                            <TrashIcon />
                        </a>
                        <a
                            href="#"
                            className="btn btn-4 btn-black play-song"
                            onClick={(e) => {
                                e.stopPropagation()
                                isPlaying(favorite.song.eid) ? pause() : playSong(favorite.song.eid)
                            }}
                        >
                            {isPlaying(favorite.song.eid) ? <PauseIcon /> : <PlayIcon />}
                        </a>
                    </span>
                </div>
            ))}
        </div>
    )

    if (resourceInContext) return resourceInContext

    return (
        <>
            <div className="favorites-page">
                <SearchInput
                    placeholder="Search favorites..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                    }}
                />
                {!loading && filteredFavorites().length > 0 && results}
                {!loading && favorites.length === 0 && NoFavorites}
                {!loading && favorites.length > 0 && filteredFavorites().length === 0 && NoResults}
            </div>
        </>
    )
}

export default FavoritesPage
