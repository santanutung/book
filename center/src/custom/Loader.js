import React from 'react'

function Loader() {
    return (
        <div style={{
            position: "fixed",
            borderWidth: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: "100%",
            backgroundColor: "rgb(10 21 78 / 22%)",
            height: "100%",
            zIndex: 10000,
            top: 0,
            flex: 1

        }}>
            {/* ./assets/images/loader.gif */}
            <img src="/centerassets/images/loader1.gif" />

        </div>
    )
}

export default Loader
