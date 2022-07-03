import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import axiosBaseUrl from "../../axiosBaseUrl";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useGlobalContexts from "../../context/GlobalState";
// import styled from "styled-components";

const cardColors = ["card-tale", "card-dark-blue", "card-darksalmon", "card-light-danger"]

const data = {
  labels: [
    "January",
    "february",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Online Earning",
      data: [
        10000, 19000, 15000, 51000, 22000, 19000, 51000, 62000, 19000, 50000,
      ],
      backgroundColor: ["rgba(106, 151, 234, 1)"],
      borderColor: ["rgba(106, 151, 234, 1)"],
      // borderWidth: 0.3
    },
    {
      label: "offline Earning",
      data: [
        5000, 6000, 11000, 39000, 12000, 50000, 39450, 61000, 11000, 44000,
      ],
      backgroundColor: ["rgba(50, 218, 209, 1)"],
      borderColor: ["rgba(50, 218, 209, 1)"],
      // borderWidth: 0.3
    },
  ],
};

const AppointmentData = {
  labels: [
    "January",
    "february",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Online Appointment",
      data: [
        100, 190, 150, 510, 220, 190, 510, 620, 190, 500,
      ],
      backgroundColor: ["rgba(106, 151, 234, 1)"],
      borderColor: ["rgba(106, 151, 234, 1)"],
      // borderWidth: 0.3
    },
    {
      label: "offline Appointment",
      data: [
        500, 600, 110, 390, 120, 500, 350, 610, 110, 440,
      ],
      backgroundColor: ["rgba(50, 218, 209, 1)"],
      borderColor: ["rgba(50, 218, 209, 1)"],
      // borderWidth: 0.3
    },
  ],
};

const CombineData = {
  labels: ["FulfilAppointment", "Upcoming Appointment", "Cancel Appointment"],
  datasets: [{
    label: "Test2",
    data: [50, 11, 22],
    backgroundColor: [
      'rgba(255, 153, 102, 1)',
      'rgba(198, 201, 202, 1)',
      'rgba(128, 116, 110, 1)',
    ],
    borderColor: [
      'rgba(255, 153, 102, 1)',
      'rgba(198, 201, 202, 1)',
      'rgba(128, 116, 110, 1)',
    ],
    // borderWidth: 0.3
  }]
};

const Stats = () => {
  const [statsData, setStatsData] = useState([])
  const [loading, setLoading] = useState(false)
  const {setLoaderState } = useGlobalContexts()
  useEffect(() => {
    getDashboardData()
  }, []);

  function getDashboardData() {
    setLoaderState(true)
    axiosBaseUrl.get(`private/center/dashboard`)
      .then((res) => {
        console.log(res.data)
        setStatsData(res.data.data)

        setLoaderState(false)

      }).catch(error => {
        console.log(error)
        setLoaderState(false)
        if (error.response) {
          Swal.fire(error.response.data.error, '', 'error')


        }
        else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      })

  }


  return (
    <>
      <Layout>
        <div className="content-wrapper">
          <div className="row">
            <div className="col-md-12 mb-3">
              <div className="row">
                <div className="col-xl-12">
                  <h3 className="font-weight-bold">Stats</h3>

                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"
                      >
                        <a href="/dashboard">Dashboard</a>
                      </li>
                      <li className="breadcrumb-item active"
                        aria-current="page">
                        Stats
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className="row stats">
            <div className="col-md-3 col-lg-2 mb-4 stretch-card transparent">
              <div className="card card-gray">
                <div className="card-body">
                  <p className="mb-4">All Bookings</p>
                  <p className="fs-30 mb-2">{statsData['allBookings']}</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 col-lg-2 mb-4 stretch-card transparent">
              <div className="card card-cadetblue">
                <div className="card-body">
                  <p className="mb-4">Pending Appointments</p>
                  <p className="fs-30 mb-2">{statsData['pendingAppointments']}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-lg-2 mb-4 stretch-card transparent">
              <Link to="/offlineAppointment" className="w-100">
              <div className={"card " + cardColors[1]}>
                <div className="card-body">
                  <p className="mb-4">Offline Appointments</p>
                  <p className="fs-30 mb-2">{statsData['offlineAppointments']}</p>
                </div>
              </div>
              </Link>
            </div>
            <div className="col-md-3 col-lg-2 mb-4 stretch-card transparent">
              <div className={"card " + cardColors[2]}>
                <div className="card-body">
                  <p className="mb-4">Offline Earning</p>
                  <p className="fs-30 mb-2">{statsData['offlineEarning']}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-2 mb-4 stretch-card transparent">
              <div className={"card " + cardColors[3]}>
                <div className="card-body">
                  <p className="mb-4">Online Appointments</p>
                  <p className="fs-30 mb-2">{statsData['onlineAppointments']}</p>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-lg-2 mb-4 stretch-card transparent">
              <div className={"card " + cardColors[4]}>
                <div className="card-body">
                  <p className="mb-4">Online Earning</p>
                  <p className="fs-30 mb-2">{statsData['onlineEarning']}</p>
                </div>
              </div>
            </div>
          </div>





          {/* <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <p className="card-title">Filters</p>

                  <div className="row">

                    <div className="col-md-6 col-xl-3 d-flex flex-column justify-content-start">
                      <div className="ml-xl-4 mt-3">
                        <select
                          className="form-control"
                        >
                          <option>Stats data</option>
                          <option>Last Days</option>
                          <option>Last Week</option>
                          <option>Last Year</option>

                        </select>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="row">
            <div className="col-xl-6 col-lg-6 mb-3">
              <div className="card card-h-100">
                <div className="card-body">
                  <Line data={AppointmentData} />
                </div>
              </div>

            </div>

            <div className="col-xl-6 col-lg-6 mb-3">
              <div className="card card-h-100">
                <div className="card-body">
                  <Bar data={data} />
                </div>
              </div>

            </div>
            <div className="col-xl-6 col-lg-6 mt-3">
              <div className="card card-h-100">
                <div className="card-body">
                  <Doughnut data={CombineData} />
                </div>
              </div>

            </div>
          </div> */}


        </div>


      </Layout>
    </>
  );
};

export default Stats;

// const Container = styled.div`
//   flex-direction: row-reverse;
//   justify-content: center;
// `;
// const Space = styled.div`
//   margin: 10px 0px;
// `;
