import React from 'react'
import Navbar from './components/partials/Navbar'
import Sidebar from './components/partials/Sidebar'
import useGlobalContexts from './context/GlobalContext'
import Loader from './ReuseableComponent/Loader'

function Layout({ children }) {
    const {loadingState} = useGlobalContexts();
    return (
        <>
        <div className="container-scroller" style={{position:"relative"}}>
            <Navbar />

            {/* partial */}
            <div className="container-fluid page-body-wrapper">

                {/* partial:partials/_sidebar.html */}
                <Sidebar />
                {/* partial */}

                {children}

            </div>
        {loadingState ? <Loader /> : '' }

        </div>
        
        </>
    )
}

export default Layout
