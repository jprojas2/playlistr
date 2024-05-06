import React from 'react'
import axios from 'axios'

export const PlayerContext = React.createContext<any>(null)

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => React.useContext(PlayerContext)

export default PlayerProvider
