import React from 'react'
import './BackButton.scss'
import { useNavigate } from 'react-router-dom'

type BackButtonProps = {
    onClick?: () => void | null
    text?: string | null
    color?: string | null
}

const BackButton: React.FC<BackButtonProps> = (props) => {
    const Navigate = useNavigate()
    return (
        <button className={`btn btn-sm btn-sm-3d btn-${props.color || 'primary'} back-button`} onClick={props.onClick ? props.onClick : () => Navigate('..')}>
            <span>&lt;&nbsp;&nbsp;</span>
            {props.text || 'Back'}
        </button>
    )
}

export default BackButton

export type backButtonProps = {
    onClick?: () => void | null
    text?: string | null
}
