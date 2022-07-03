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
                backgroundColor: "rgb(11 35 101 / 37%)",
                height: "100%",
                zIndex: 100000,
                top: 0,
                flex: 1
    
            }}>
                {/* ./assets/images/loader.gif */}
                <img src="/assets/images/loader1.gif" />
    
            </div>
    )
}

export default Loader
