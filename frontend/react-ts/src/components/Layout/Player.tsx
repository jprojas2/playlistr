import React from 'react'
import './Player.scss'
import axios from 'axios'
import { useAuth } from '../../providers/AuthProvider'
import { usePlayer } from '../../layouts/MainLayout'

const Player: React.FC = () => {
    const { playerData, setPlayerData } = usePlayer()
    const { token } = useAuth()

    React.useEffect(() => {
        // Fetch data
        axios
            .get('api/v1/player', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
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
                        <span className="song-title">{playerData?.current_song?.name}</span>
                        <span className="song-artist">{playerData?.current_song?.artist?.name}</span>
                        <span className="song-album">{playerData?.current_song?.album?.name}</span>
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
