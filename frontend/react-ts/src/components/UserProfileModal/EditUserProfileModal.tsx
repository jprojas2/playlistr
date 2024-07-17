import React from 'react'
import ArrowLeftIcon from '../Icons/ArrowLeftIcon'
import axios from 'axios'

interface EditUserProfileModalProps {
    setModalState: any
}

const EditUserProfileModal: React.FC<EditUserProfileModalProps> = ({ setModalState }) => {
    const [password, setPassword] = React.useState('')
    const [newPassword, setNewPassword] = React.useState('')

    const handleUserUpdate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        axios.patch(`/api/v1/user`, { user: { password: newPassword, password_challenge: password } }).then((res) => {
            setModalState({ general: true })
        })
    }
    return (
        <div className="modal user-profile-modal edit-profile-modal prevent-click">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="back" onClick={() => setModalState({ general: true })}>
                        <ArrowLeftIcon />
                    </div>
                    <span className="modal-title">CHANGE PASSWORD</span>
                </div>
                <div className="modal-body">
                    <form className="user-form">
                        <div className="user-fields">
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Current password" />
                            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password" />
                        </div>
                        <div className="user-actions">
                            <button type="submit" className="btn btn-2 btn-primary" onClick={handleUserUpdate}>
                                Save
                            </button>
                            <button className="btn btn-2" onClick={() => setModalState({ general: true })}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditUserProfileModal
