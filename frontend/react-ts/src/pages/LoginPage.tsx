import React from 'react'
import './LoginPage.scss'
import { useAuth } from '../providers/AuthProvider'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import Background from '~/components/Layout/Background'

const LoginPage: React.FC = () => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const { setToken, token } = useAuth()
    const navigate = useNavigate()

    React.useEffect(() => {
        if (token) {
            navigate('/browse')
        }
    }, [])

    const handleLogin = () => {
        axios
            .post('/api/login', { email, password })
            .then((res) => {
                setToken(res.data.token)
                navigate('/browse')
            })
            .catch((e) => {
                console.error(e)
                alert('Login failed')
            })
    }

    return (
        <>
            <div className="login-page">
                <div className="login-page-content">
                    <h1>PLAYLISTR</h1>
                    <div className="login-fields">
                        <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="E-mail" />
                        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" />
                        <button className="btn btn-black" onClick={handleLogin}>
                            LOGIN
                        </button>
                    </div>
                </div>
            </div>
            <Background />
        </>
    )
}

export default LoginPage
