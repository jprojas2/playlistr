import React from 'react'
import './Sidebar.scss'
import { NavLink, NavLinkProps } from 'react-router-dom'

const sidebarLinks = [
    { linkText: 'Browse', pathname: 'browse' },
    { linkText: 'Playlists', pathname: 'playlists' },
    { linkText: 'Favorites', pathname: 'favorites' }
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
        </aside>
    )
}

export default Sidebar

export { sidebarLinks }
