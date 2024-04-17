import React from 'react'

interface AnimatedLoadingProps {
    text?: string
}

const AnimatedLoading: React.FC<AnimatedLoadingProps> = (props) => {
    return (
        <span className="animated-loading">
            {(props.text || 'Loading...').split('').map((char, index) => (
                <span role="alert" key={index}>
                    {char}
                </span>
            ))}
        </span>
    )
}

export default AnimatedLoading
