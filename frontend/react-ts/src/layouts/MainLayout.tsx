import React, { createContext } from 'react'
import { Outlet } from 'react-router-dom'
import './MainLayout.scss'
import Player from '../components/Layout/Player'
import Sidebar from '../components/Layout/Sidebar'
import Background from '../components/Layout/Background'

const PlayerContext = createContext<any>(null)

const MainLayout: React.FC = () => {
    const [playerData, setPlayerData] = React.useState<any>(null)
    return (
        <PlayerContext.Provider value={{ playerData, setPlayerData }}>
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
