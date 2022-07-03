import React, { useState, useEffect, useContext } from 'react'
import Layout from '../Layout'

import DashboardOverview from '../dashboard/DashboardOverview';
import DashboardStats from '../dashboard/DashboardStats';


// import { SocketContext } from '../context/socket';

import { io } from 'socket.io-client';
import DashboardDemographies from '../dashboard/DashboardDemographies';
import Loader from '../ReuseableComponent/Loader';

let socket;

function Dashboard() {

  // const socket = useContext(SocketContext);
 
  useEffect(() => {
    
    //
  }, [])


  






  const [tabs, setTabs] = useState('overview')


  return (
    <>
      <Layout>
     
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="row">
              <div className="col-sm-12">
                <div className="home-tab">
                  <div className="d-sm-flex align-items-center justify-content-between border-bottom">
                    <ul className="nav nav-tabs" role="tablist">
                      <li className="nav-item">
                        <button
                          className={`nav-link ${tabs == "overview" ? 'active' : ''}`}
                          onClick={(e) => setTabs("overview")}
                        >
                          Overview
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${tabs == "stats" ? 'active' : ''}`}
                          onClick={(e) => setTabs("stats")}
                        >
                          Stats
                        </button>
                      </li>
                      {/* <li className="nav-item">
                        <button
                          className={`nav-link ${tabs == "demography" ? 'active' : ''}`}
                          onClick={(e) => setTabs("demography")}
                        >
                          Demographics
                        </button>
                      </li> */}

                    </ul>
                    {/* <div>
                      <div className="btn-wrapper">
                        <a
                          href="#"
                          className="btn btn-otline-dark align-items-center"
                        >
                          <i className="icon-share" /> Share
                        </a>
                        <a href="#" className="btn btn-otline-dark">
                          <i className="icon-printer" /> Print
                        </a>
                        <a href="#" className="btn btn-primary text-white me-0">
                          <i className="icon-download" /> Export
                        </a>
                      </div>
                    </div> */}
                  </div>
                  {
                    tabs == "overview" ?
                      <DashboardOverview tabs={tabs} setTabs={setTabs} />
                      : tabs == "stats" ?
                        <DashboardStats />
                        :
                        ''
                        // tabs == "demography" ?
                        //   <DashboardDemographies />
                        //   : null

                  }
                </div>
              </div>
            </div>
          </div>
          {/* content-wrapper ends */}

        </div>
        {/* main-panel ends */}
      </Layout>
    </>

  )
}

export default Dashboard
