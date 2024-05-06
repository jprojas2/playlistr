import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MainLayout from './layouts/MainLayout'
import NotFoundPage from './pages/NotFoundPage'
import BrowsePage from './pages/BrowsePage'
import PlaylistsPage from './pages/PlaylistsPage'
import FavoritesPage from './pages/FavoritesPage'
import { ROUTES } from './resources/routes-constants'
import './styles/main.scss'
import AuthProvider, { useAuth } from './contexts/AuthContext'
import ModalProvider from './contexts/ModalContext'

const AuthComponent: React.FC = () => {
    const { token } = useAuth()
    if (!token) return <Navigate to={ROUTES.LOGIN_ROUTE} />

    return <Outlet />
}

const RootComponent: React.FC = () => {
    return (
        <AuthProvider>
            <ModalProvider>
                <Router>
                    <Routes>
                        <Route path="*" element={<NotFoundPage />} />
                        <Route path={ROUTES.LOGIN_ROUTE} element={<LoginPage />} />
                        <Route element={<AuthComponent />}>
                            <Route element={<MainLayout />}>
                                <Route path={ROUTES.HOMEPAGE_ROUTE} element={<Navigate to="/browse" />} />
                                <Route path={ROUTES.BROWSE_ROUTE} element={<BrowsePage />} />
                                <Route path={ROUTES.PLAYLISTS_ROUTE} element={<PlaylistsPage />} />
                                <Route path={ROUTES.FAVORITES_ROUTE} element={<FavoritesPage />} />
                            </Route>
                        </Route>
                    </Routes>
                </Router>
            </ModalProvider>
        </AuthProvider>
    )
}

export default RootComponent
