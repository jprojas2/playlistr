import React from 'react'
import './UserProfileModal.scss'
import { useAuth } from '../contexts/AuthContext'
import ModalProvider, { useModal } from '../contexts/ModalContext'
import ImageIcon from './Icons/ImageIcon'
import AvatarCropModal from './UserProfileModal/AvatarCropModal'
import EditUserProfileModal from './UserProfileModal/EditUserProfileModal'
import axios from 'axios'

const UserProfileModal: React.FC = () => {
    const { setToken, user, setUser } = useAuth()
    const { closeModal } = useModal()
    const [modalState, setModalState] = React.useState<any>({ general: true, edit: false, password: false })

    React.useEffect(() => {
        axios.get('/api/v1/user').then((res) => {
            setUser(res.data)
        })
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                user.avatarData = reader.result
                setModalState({ avatarCrop: true })
            }
        }
    }

    const removeAvatar = () => {
        axios.delete('/api/v1/user/delete_avatar').then((res) => {
            setUser(res.data)
        })
    }

    return (
        <>
            {modalState.general && (
                <div className="modal user-profile-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">MY PROFILE</span>
                        </div>
                        <div className="modal-body">
                            <div className="user-avatar">
                                {user?.avatar && (
                                    <>
                                        <img src={user.avatar} alt="user" />
                                        <div className="avatar-edit-overlay" onClick={() => removeAvatar()}>
                                            <span>Remove</span>
                                        </div>
                                    </>
                                )}
                                {!user?.avatar && (
                                    <>
                                        <img src="https://via.placeholder.com/150" alt="user" />
                                        <div
                                            className="avatar-edit-overlay"
                                            onClick={(e) => {
                                                ;(document.querySelector('.avatar-edit-overlay input[type="file"]') as HTMLElement)?.click()
                                            }}
                                        >
                                            <ImageIcon />
                                            <input type="file" accept="image/*" onChange={handleFileChange} />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="user-info">
                                <div className="user-name">{user?.name}</div>
                                <div className="user-email">{user?.email}</div>
                            </div>
                            <div className="user-actions">
                                <button
                                    className="btn btn-2 btn-primary"
                                    onClick={() => {
                                        setModalState({ edit: true })
                                    }}
                                >
                                    Change Password
                                </button>
                                <button
                                    className="btn btn-2 btn-danger"
                                    onClick={() => {
                                        setToken('')
                                        closeModal()
                                    }}
                                >
                                    Logout
                                </button>
                                <button
                                    className="btn btn-2"
                                    onClick={() => {
                                        closeModal()
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {modalState.edit && <EditUserProfileModal setModalState={setModalState} />}
            {modalState.avatarCrop && <AvatarCropModal user={user} setUser={setUser} setModalState={setModalState} />}
        </>
    )
}

export default UserProfileModal
