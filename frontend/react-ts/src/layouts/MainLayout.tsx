import React, { createContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import './MainLayout.scss'
import Player from '../components/MainLayout/Player'
import Sidebar from '../components/MainLayout/Sidebar'
import Background from '../components/MainLayout/Background'
import { useAuth } from '~/contexts/AuthContext'

const MainLayout: React.FC = () => {
    const { token } = useAuth()

    return (
        <>
            <Background />
            {!token && <Outlet />}
            {token && (
                <>
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
            )}
        </>
    )
}

export default MainLayout
