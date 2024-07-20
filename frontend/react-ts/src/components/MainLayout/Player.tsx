import React from 'react'
import './Player.scss'
import { usePlayer } from '../../contexts/PlayerContext'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '~/resources/routes-constants'
import NextIcon from '../Icons/NextIcon'
import PreviousIcon from '../Icons/PreviousIcon'
import PauseIcon from '../Icons/PauseIcon'
import PlayIcon from '../Icons/PlayIcon'

const Player: React.FC = () => {
    const { playerData, getPlayerData, next, getProgress, play, pause, previous } = usePlayer()
    const [progress, setProgress] = React.useState<number>(-1)
    const Navigate = useNavigate()

    React.useEffect(() => {
        getPlayerData()
    }, [])

    React.useEffect(() => {
        if (progress >= 100 && playerData?.playing) {
            next()
            return
        }
        const interval = setInterval(() => {
            if (playerData?.playing) setProgress(getProgress())
        }, 100)
        return () => clearInterval(interval)
    }, [progress])

    React.useEffect(() => {
        setProgress(getProgress())
    }, [playerData])

    return (
        <div className="main-player">
            <div className="progress-bar">
                <div className="progress" style={{ width: progress + '%' }}></div>
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
                        <button className="btn btn-3d" onClick={() => previous()}>
                            <PreviousIcon />
                        </button>
                        <button
                            className={`btn btn-black ${playerData?.playing ? 'playing' : ''}`}
                            onClick={() => {
                                playerData?.playing ? pause() : play()
                            }}
                        >
                            <PauseIcon />
                            <PlayIcon />
                        </button>
                        <button className="btn" onClick={() => next()}>
                            <NextIcon />
                        </button>
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
