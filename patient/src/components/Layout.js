import React, { useEffect } from 'react'
import useGlobalContexts from '../context/GlobalContext'
import Loader from '../ReusableComponents/Loader'
import Footer from './partials/Footer'
import Header from './partials/Header'
// import Sidebar from './components/partials/Sidebar'
// import Header from './partials/Header'

function Layout({ children }) {
    const {loaderState,setremoveNotification} = useGlobalContexts()
   
    return (
        <>
        <div>

            <Header />
            <main onClick={() => setremoveNotification(false)} id="main">
                {children}
           </main>
            
            <a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>

        </div>
        {
            loaderState ?   <Loader /> : ''
        }
        <Footer />
       
      
    
        </>
    )
}

export default Layout
