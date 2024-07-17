import React from 'react'
import CheckIcon from '../Icons/CheckIcon'
import CloseIcon from '../Icons/CloseIcon'
import ZoomIn from '../Icons/ZoomIn'
import ZoomOut from '../Icons/ZoomOut'
import './AvatarCropModal.scss'
import axios from 'axios'

interface AvatarCropModalProps {
    user: any
    setUser: any
    setModalState: any
}

const AvatarCropModal: React.FC<AvatarCropModalProps> = ({ user, setUser, setModalState }) => {
    const [zoom, setZoom] = React.useState(0)
    const [initial, setInitial] = React.useState({ x: 0, y: 0, left: 0, top: 0 })
    const [isDragging, setIsDragging] = React.useState(false)
    const [styles, setStyles] = React.useState<{ left: number; top: number }>({ left: 0, top: 0 })
    const [ratio, setRatio] = React.useState(1)
    const height = (1 + zoom / 100) * 250

    React.useEffect(() => {
        document.addEventListener('mouseup', dragEnd)
        document.addEventListener('mousemove', dragging)
        let img = document.querySelector('.avatar-image img') as HTMLImageElement
        if (img) {
            img.onload = () => {
                console.log(img.width, img.height)
                setRatio(img.width / img.height)
            }
        }
        return () => {
            document.removeEventListener('mouseup', dragEnd)
            document.removeEventListener('mousemove', dragging)
        }
    }, [])

    const dragStart = (e: any) => {
        setInitial({ x: e.screenX, y: e.screenY, left: styles.left, top: styles.top })
        setIsDragging(true)
    }
    const dragging = (e: any) => {
        if (isDragging) {
            var left = e.screenX - initial.x + initial.left
            var top = e.screenY - initial.y + initial.top
            var position = getProcessedPosition(top, left, height)
            setStyles({ left: position.left, top: position.top })
        }
    }

    const handleZoom = (e: any) => {
        var height = (1 + e.target.value / 100) * 250
        var top = styles.top
        var left = styles.left
        var position = getProcessedPosition(top, left, height)
        setZoom(e.target.value)
        setStyles({ left: position.left, top: position.top })
    }

    const dragEnd = (e: any) => {
        setIsDragging(false)
    }

    const getProcessedPosition = (top: number, left: number, _height: number) => {
        let _width = _height * ratio
        if (top > (_height - 250) / 2) top = (_height - 250) / 2
        else if (top < -(_height - 250) / 2) top = -(height - 250) / 2
        if (left > (_width - 250) / 2) left = (_width - 250) / 2
        else if (left < -(_width - 250) / 2) left = -(_width - 250) / 2
        return { top, left }
    }

    const getCropOptions = () => {
        let img = document.querySelector('.avatar-image img') as HTMLImageElement
        let crop = document.querySelector('.avatar-crop') as HTMLElement

        let imgBCR = img.getBoundingClientRect()
        let cropBCR = crop.getBoundingClientRect()

        let multiplier = img.naturalWidth / img.width

        let x = (cropBCR.left - imgBCR.left) * multiplier
        let y = (cropBCR.top - imgBCR.top) * multiplier
        let width = cropBCR.width * multiplier
        let height = cropBCR.height * multiplier

        return { x, y, width, height }
    }

    const handleAvatarUpload = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        axios.patch('/api/v1/user', { user: { avatar_data: user.avatarData, crop_options: getCropOptions() } }).then((res) => {
            setUser(res.data)
            setModalState({ general: true })
        })
    }

    return (
        <div className="modal avatar-crop-modal prevent-click">
            <div className="modal-content">
                <div className="modal-header">
                    <span className="modal-title">SETUP AVATAR</span>
                </div>
                <div className="modal-body">
                    <div className="avatar-image">
                        <img
                            src={user.avatarData}
                            onMouseDown={dragStart}
                            onMouseMove={dragging}
                            onMouseUp={dragEnd}
                            draggable={false}
                            alt="avatar"
                            style={{ height: height, ...styles }}
                        />
                        <div className="avatar-crop"></div>
                        <div className="avatar-overlay"></div>
                    </div>
                    <div className="avatar-zoom">
                        <div className="zoom-out">
                            <ZoomOut />
                        </div>
                        <div className="zoom-range">
                            <input type="range" max={500} value={zoom} onChange={handleZoom} />
                        </div>
                        <div className="zoom-in">
                            <ZoomIn />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="actions">
                        <button
                            onClick={() => {
                                setModalState({ general: true })
                            }}
                            className="btn btn-3 cancel"
                        >
                            <div className="icon">
                                <CloseIcon />
                            </div>
                            Cancel
                        </button>
                        <button className="btn btn-3 btn-primary commit" onClick={handleAvatarUpload}>
                            <div className="icon">
                                <CheckIcon />
                            </div>
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AvatarCropModal
