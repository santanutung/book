import React from 'react'

function About(props) {
    const {center} = props
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: center.introduction }} />
        </div>
    )
}

export default About
