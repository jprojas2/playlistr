import React from 'react'
import './User.scss'
import { useModal } from '../../contexts/ModalContext'
import UserProfileModal from '../UserProfileModal'
import { useAuth } from '../../contexts/AuthContext'

const User = () => {
    const { openModal, closeModal } = useModal()
    const { user } = useAuth()

    return (
        <div className="user" onClick={() => openModal(<UserProfileModal />)}>
            <div className="user-content">
                <div className="user-image">
                    {user.avatar && <img src={user.avatar} alt="user" />}
                    {!user.avatar && <img src="https://via.placeholder.com/150" alt="user" />}
                </div>
                <div className="user-info">
                    <div className="user-name">My Profile</div>
                </div>
            </div>
        </div>
    )
}

export default User
