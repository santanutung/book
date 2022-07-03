import React from 'react'
import { Pie, Bar, Line } from 'react-chartjs-2';

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
            label: "Center Online Earning",
            data: [
                10000, 19000, 15000, 51000, 22000, 19000, 51000, 62000, 19000, 50000,
            ],
            backgroundColor: ["rgb(255, 99, 132)"],
            borderColor: ["rgb(255, 99, 132)"],
            // borderWidth: 0.3
        },
        {
            label: "Center Offline Earning",
            data: [
                5000, 6000, 11000, 39000, 12000, 50000, 39450, 61000, 11000, 44000,
            ],
            backgroundColor: ["rgb(153, 102, 255)"],
            borderColor: ["rgb(153, 102, 255)"],
            // borderWidth: 0.3
        },
    ],
};


const earningData = {
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
            label: "Subscription Earning",
            data: [
                10000, 19000, 15000, 51000, 22000, 19000, 51000, 62000, 19000, 50000,
            ],
            backgroundColor: ["red"],
            borderColor: ["red"],
            // borderWidth: 0.3
        },
        {
            label: "Commission Earning",
            data: [
                5000, 6000, 11000, 39000, 12000, 50000, 39450, 61000, 11000, 44000,
            ],
            backgroundColor: ["green"],
            borderColor: ["green"],
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
      {
        label: "Cancel Appointment",
        data: [
          500, 600, 110, 390, 120, 500, 350, 610, 110, 440,
        ],
        backgroundColor: ["rgb(255, 99, 132)"],
        borderColor: ["rgb(255, 99, 132)"],
        // borderWidth: 0.3
      },
    ],
  };

function DashboardStats() {
    return (
        <div className="tab-content tab-content-basic">

            <div className="row">
            <lable>Filters</lable>
                <div className="col-md-2">
                  
                    <select className="form-control">
                        <option>Year</option>
                        <option>Month</option>
                        <option>Week</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="form-control">
                        <option>Select Center</option>
                        <option>Center 1</option>
                        <option>Center 2</option>
                    </select>
                </div>
            </div>
            <div
                className="tab-pane fade show active mt-3"
                id="overview"
                role="tabpanel"
                aria-labelledby="overview"
            >
                <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">

                                <Line data={data} />
                            </div>

                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">

                                <Bar data={AppointmentData} />
                            </div>

                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">

                                <Line data={earningData} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardStats
