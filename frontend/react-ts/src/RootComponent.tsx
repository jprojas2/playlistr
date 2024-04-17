import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MainLayout from './layouts/MainLayout'
import NotFoundPage from './pages/NotFoundPage'
import { ROUTES } from './resources/routes-constants'
import './styles/main.scss'
import AuthProvider, { useAuth } from './providers/AuthProvider'

const AuthComponent: React.FC = () => {
    const { token } = useAuth()
    if (!token) return <Navigate to={ROUTES.LOGIN_ROUTE} />

    return <Outlet />
}

const RootComponent: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path={ROUTES.LOGIN_ROUTE} element={<LoginPage />} />
                    <Route element={<AuthComponent />}>
                        <Route element={<MainLayout />}>
                            <Route path={ROUTES.HOMEPAGE_ROUTE} element={<HomePage />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default RootComponent
