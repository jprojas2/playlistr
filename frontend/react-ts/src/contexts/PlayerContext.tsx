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

    const previous = () => {
        axios.post('http://localhost:3001/api/v1/player/previous').then((response) => {
            setPlayerData(response.data)
        })
    }

    const next = () => {
        axios.post('http://localhost:3001/api/v1/player/next').then((response) => {
            setPlayerData(response.data)
        })
    }

    const playSong = (songId: string) => {
        axios.post(`http://localhost:3001/api/v1/songs/${songId}/play`).then((response) => {
            getPlayerData()
        })
    }

    const playSongNext = (songId: string) => {
        axios.post(`http://localhost:3001/api/v1/songs/${songId}/play_next`).then((response) => {
            getPlayerData()
        })
    }

    const addSongToQueue = (songId: string) => {
        axios.post(`http://localhost:3001/api/v1/songs/${songId}/add_to_queue`).then((response) => {
            getPlayerData()
        })
    }

    const playPlaylist = (playlistId: string) => {
        axios.post(`http://localhost:3001/api/v1/playlists/${playlistId}/play`).then((response) => {
            getPlayerData()
        })
    }

    const playFavorite = (favoriteId: number) => {
        axios.post(`http://localhost:3001/api/v1/favorites/${favoriteId}/play`).then((response) => {
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

    const getProgress = () => {
        if (!playerData?.current_song) return 0

        const pausedAt = playerData.paused_at || 0
        const startedAt = playerData.playing ? new Date(playerData.started_at) : new Date()
        const now = new Date()
        const duration = playerData.current_song.duration || 200000
        const elapsed = now.getTime() - startedAt.getTime() + pausedAt * 1000

        return (elapsed / duration) * 100
    }

    return (
        <PlayerContext.Provider
            value={{
                playerData,
                setPlayerData,
                getPlayerData,
                play,
                pause,
                previous,
                next,
                playSong,
                playSongNext,
                addSongToQueue,
                playPlaylist,
                playPlaylistSong,
                playFavorite,
                isPlaying,
                getProgress
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => React.useContext(PlayerContext)

export default PlayerProvider
