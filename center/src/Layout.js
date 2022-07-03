import React from 'react'
import Navbar from './components/partials/Navbar'
import Sidebar from './components/partials/Sidebar'
import useGlobalContexts from './context/GlobalState'
import Loader from './custom/Loader'

function Layout({ children }) {
    const { loaderState } = useGlobalContexts()
    return (
        <>
        <div className="container-scroller">
            <Navbar />

            {/* partial */}
            <div className="container-fluid page-body-wrapper">

                {/* partial:partials/_sidebar.html */}
                <Sidebar />
                {/* partial */}

                {children}

            </div>
        </div>
        {loaderState ? <Loader /> : ''}
        
        </>
    )
}

export default Layout
