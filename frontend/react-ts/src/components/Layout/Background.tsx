import React from 'react'
import './Background.scss'
import AlbumIcon from '../Icons/AlbumIcon'

const ICON_SIZE = 40
const ICON_SPACE = 20
const ICON_COLOR = '#000000'
const ICON_SECONDARY_COLOR = 'red'
const BG_ANGLE = -14

const Background: React.FC = () => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 })

    React.useEffect(() => {
        return
        const interval = setInterval(() => {
            setPosition((prev) => {
                if (prev.x >= 246) {
                    return {
                        x: 0,
                        y: 0
                    }
                }
                return {
                    x: prev.x + 0.1,
                    y: prev.y + 0.1
                }
            })
        }, 10)
    }, [])

    const patternHeight = window.innerHeight * 2
    const patternWidth = window.innerWidth * 2
    const bgArea = patternHeight * patternWidth
    const iconArea = (ICON_SIZE + ICON_SPACE) * (ICON_SIZE + ICON_SPACE)
    const iconCount = bgArea / iconArea
    const iconsPerRow = Math.floor(patternWidth / (ICON_SIZE + ICON_SPACE))
    const rows = Math.ceil(iconCount / iconsPerRow)
    // create a pattern of album icons
    const pattern = Array.from({ length: rows }, (_, i) => {
        const rowItems = Array.from({ length: iconsPerRow }, (_, j) => {
            return (
                <div key={`${j}_${i}_bg_item`} className="pattern-item" style={{ height: ICON_SIZE, width: ICON_SIZE, margin: ICON_SPACE / 2 }}>
                    <AlbumIcon light={((i % 2) + j) % 2 == 0} />
                </div>
            )
        })
        return (
            <div key={`${i}_bg_row`} className="pattern-row">
                {rowItems}
            </div>
        )
    })
    // return the pattern with style transform angle

    return (
        <div
            className="pattern-background"
            style={{
                top: position.y,
                left: position.x,
                transform: `rotate(${BG_ANGLE}deg) translate(-25%, -50%)`,
                transformOrigin: 'center center',
                height: patternHeight,
                width: patternWidth
            }}
        >
            {pattern}
        </div>
    )
}

export default Background
