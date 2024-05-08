import React from 'react'
import './Player.scss'
import axios from 'axios'
import { usePlayer } from '../../contexts/PlayerContext'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'

const Player: React.FC = () => {
    const { playerData, setPlayerData } = usePlayer()
    const Navigate = useNavigate()

    React.useEffect(() => {
        axios.get('api/v1/player').then((response) => {
            setPlayerData(response.data)
        })
    }, [])

    return (
        <div className="main-player">
            <div className="progress-bar">
                <div className="progress" style={{ width: '50%' }}></div>
            </div>
            <div className="player-body">
                <div className="player-body-left">
                    <div className="song-art">
                        {playerData?.current_song && <img src={playerData?.current_song.image_url} alt="Song Art" />}
                        {!playerData?.current_song && <img src="https://via.placeholder.com/150" alt="Song Art" />}
                    </div>
                    <div className="song-info">
                        <a
                            className="song-title"
                            onClick={() => {
                                Navigate(`${ROUTES.BROWSE_ROUTE}/${ROUTES.BROWSE_SUBROUTES.SONGS_ROUTE}/${playerData?.current_song?.eid}`)
                            }}
                        >
                            {playerData?.current_song?.name}
                        </a>
                        <span
                            className="song-artist"
                            onClick={() => {
                                Navigate(`${ROUTES.BROWSE_ROUTE}/${ROUTES.BROWSE_SUBROUTES.ARTISTS_ROUTE}/${playerData?.current_song?.artist?.eid}`)
                            }}
                        >
                            {playerData?.current_song?.artist?.name}
                        </span>
                        <span
                            className="song-album"
                            onClick={() => {
                                Navigate(`${ROUTES.BROWSE_ROUTE}/${ROUTES.BROWSE_SUBROUTES.ALBUMS_ROUTE}/${playerData?.current_song?.album?.eid}`)
                            }}
                        >
                            {playerData?.current_song?.album?.name}
                        </span>
                    </div>
                </div>
                <div className="player-body-center">
                    <div className="player-controls">
                        <button className="btn">Previous</button>
                        <button className="btn">Play</button>
                        <button className="btn">Next</button>
                    </div>
                </div>
                <div className="player-body-right">
                    <a href="#" className="btn btn-1">
                        Go to overlay
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Player
