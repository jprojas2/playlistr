import React, { createContext, useContext, useMemo } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = React.useState(localStorage.getItem('token'))

    React.useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
            axios.interceptors.response.use(
                (response) => response,
                (error) => {
                    if (error.response.status === 401) {
                        setToken(null)
                    }
                    return Promise.reject(error)
                }
            )
            localStorage.setItem('token', token)
        } else {
            delete axios.defaults.headers.common['Authorization']
            localStorage.removeItem('token')
        }
    }, [token])

    const contextValue = useMemo(
        () => ({
            token,
            setToken
        }),
        [token]
    )

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthProvider
