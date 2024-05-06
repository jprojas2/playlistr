import React, { createContext } from 'react'
import { Outlet } from 'react-router-dom'
import './MainLayout.scss'
import Player from '../components/Layout/Player'
import Sidebar from '../components/Layout/Sidebar'
import Background from '../components/Layout/Background'

const MainLayout: React.FC = () => {
    return (
        <>
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
        </>
    )
}

export default MainLayout
