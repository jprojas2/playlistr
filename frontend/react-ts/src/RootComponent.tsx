import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MainLayout from './layouts/MainLayout'
import NotFoundPage from './pages/NotFoundPage'
import BrowsePage from './pages/BrowsePage'
import PlaylistsPage from './pages/PlaylistsPage'
import FavoritesPage from './pages/FavoritesPage'
import SongPage from './pages/SongPage'
import ArtistPage from './pages/ArtistPage'
import PlaylistPage from './pages/PlaylistPage'
import AlbumPage from './pages/AlbumPage'
import { ROUTES } from './resources/routes-constants'
import './styles/main.scss'
import AuthProvider, { useAuth } from './contexts/AuthContext'
import ModalProvider from './contexts/ModalContext'
import PlayerProvider from './contexts/PlayerContext'

const AuthComponent: React.FC = () => {
    const { token } = useAuth()
    if (!token) return <Navigate to={ROUTES.LOGIN_ROUTE} />

    return <Outlet />
}

const RootComponent: React.FC = () => {
    return (
        <AuthProvider>
            <ModalProvider>
                <PlayerProvider>
                    <Router>
                        <Routes>
                            <Route path="*" element={<NotFoundPage />} />
                            <Route element={<MainLayout />}>
                                <Route path={ROUTES.LOGIN_ROUTE} element={<LoginPage />} />
                                <Route element={<AuthComponent />}>
                                    <Route path={ROUTES.HOMEPAGE_ROUTE} element={<Navigate to="/browse" />} />
                                    <Route path={ROUTES.BROWSE_ROUTE}>
                                        <Route path={`${ROUTES.BROWSE_SUBROUTES.SONGS_ROUTE}/:id`} element={<SongPage />} />
                                        <Route path={`${ROUTES.BROWSE_SUBROUTES.ARTISTS_ROUTE}/:id`} element={<ArtistPage />} />
                                        <Route path={`${ROUTES.BROWSE_SUBROUTES.ALBUMS_ROUTE}/:id`} element={<AlbumPage />} />
                                        <Route path="" element={<BrowsePage />} />
                                    </Route>
                                    <Route path={ROUTES.PLAYLISTS_ROUTE}>
                                        <Route path=":id" element={<PlaylistPage />} />
                                        <Route path="" element={<PlaylistsPage />} />
                                    </Route>
                                    <Route path={ROUTES.FAVORITES_ROUTE} element={<FavoritesPage />} />
                                </Route>
                            </Route>
                        </Routes>
                    </Router>
                </PlayerProvider>
            </ModalProvider>
        </AuthProvider>
    )
}

export default RootComponent
