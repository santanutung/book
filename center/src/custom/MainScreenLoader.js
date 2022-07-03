import React from 'react'

function MainScreenLoader() {
    return (
        <div style={{
            borderWidth: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: "100%",
            backgroundColor: "rgb(165 165 165 / 70%)",
            zIndex: 100,
            top: 0

        }}>

            <img src="/centerassets/images/loader1.gif" />

        </div>
    )
}

export default MainScreenLoader
