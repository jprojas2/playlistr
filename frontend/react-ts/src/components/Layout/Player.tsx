import React from 'react'
import './Player.scss'

const Player: React.FC = () => {
    return (
        <div className="main-player">
            <div className="progress-bar">
                <div className="progress" style={{ width: '50%' }}></div>
            </div>
            <div className="player-body">
                <div className="player-body-left">
                    <div className="song-art">
                        <img src="https://via.placeholder.com/150" alt="Song Art" />
                    </div>
                    <div className="song-info">
                        <span className="song-title">Live Forever</span>
                        <span className="song-artist">Oasis</span>
                        <span className="song-album">Definitely Maybe (1994)</span>
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
