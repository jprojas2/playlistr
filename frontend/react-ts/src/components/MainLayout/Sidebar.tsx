import React from 'react'
import './Sidebar.scss'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'
import User from './User'

const sidebarLinks = [
    { linkText: 'Browse', pathname: ROUTES.BROWSE_ROUTE },
    { linkText: 'Playlists', pathname: ROUTES.PLAYLISTS_ROUTE },
    { linkText: 'Favorites', pathname: ROUTES.FAVORITES_ROUTE }
]

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="app-name">PLAYLISTR</span>
            </div>

            <div className="nav">
                {sidebarLinks.map((link: any, index: number) => (
                    <NavLink key={index} to={link.pathname} className={({ isActive }) => 'nav-item sidebar-item ' + (isActive ? 'active' : 'inactive')}>
                        <span>{link.linkText}</span>
                    </NavLink>
                ))}
            </div>
            <User />
        </aside>
    )
}

export default Sidebar

export { sidebarLinks }
