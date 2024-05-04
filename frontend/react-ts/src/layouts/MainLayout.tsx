import React, { createContext } from 'react'
import { Outlet } from 'react-router-dom'
import './MainLayout.scss'
import Player from '../components/Layout/Player'
import Sidebar from '../components/Layout/Sidebar'
import Background from '../components/Layout/Background'
import axios from 'axios'

const PlayerContext = createContext<any>(null)

const MainLayout: React.FC = () => {
    const [playerData, setPlayerData] = React.useState<any>(null)

    const getPlayerData = () => {
        axios.get('http://localhost:3001/api/v1/player').then((response) => {
            setPlayerData(response.data)
        })
    }

    const play = () => {
        axios.post('http://localhost:3001/api/v1/player/play').then((response) => {
            setPlayerData(response.data)
        })
    }

    const pause = () => {
        axios.post('http://localhost:3001/api/v1/player/pause').then((response) => {
            setPlayerData(response.data)
        })
    }

    const playSong = (songId: string) => {
        axios.post(`http://localhost:3001/api/v1/songs/${songId}/play`).then((response) => {
            getPlayerData()
        })
    }

    const playPlaylist = (playlistId: string) => {
        axios.post(`http://localhost:3001/api/v1/playlists/${playlistId}/play`).then((response) => {
            getPlayerData()
        })
    }

    const playPlaylistSong = (playlistId: string, songIndex: number) => {
        axios.post(`http://localhost:3001/api/v1/playlists/${playlistId}/playlist_songs/${songIndex}/play`).then((response) => {
            getPlayerData()
        })
    }

    const isPlaying = (songId?: number | null) => {
        if (!playerData?.playing) return false
        if (songId) return playerData?.current_song?.eid === songId
        return true
    }

    return (
        <PlayerContext.Provider value={{ playerData, setPlayerData, play, pause, playSong, playPlaylist, playPlaylistSong, isPlaying }}>
            <Background />
            <div className="main-wrapper">
                <main className="main">
                    <Sidebar />
                    <div className="content">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Player />
        </PlayerContext.Provider>
    )
}

export default MainLayout
export const usePlayer = () => React.useContext(PlayerContext)
