import React, { useContext, useMemo } from 'react'
import axios from 'axios'

export const AuthContext = React.createContext<any>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = React.useState(localStorage.getItem('token'))

    React.useLayoutEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
            axios.interceptors.response.use(
                (response) => response,
                (error) => {
                    if (error.response?.status === 401) {
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

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
