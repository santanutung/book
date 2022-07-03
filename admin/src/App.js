import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Table from './components/Table';
import CenterRequest from './center/CenterRequest';
import AddCenterScreen from './center/AddCenterScreen';


import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import ManageCenter from './center/ManageCenter';
import EditCenterScreen from './center/EditCenterScreen';
import CenterProfileScreen from './center/CenterProfileScreen';
import UpcomingAppointments from './appointments/UpcomingAppointments';
// import AppointmentHistory from './appointments/AppointmentHistory';
import PatientListScreen from './patients/PatientListScreen';
import ManageEmployeeScreen from './employee/ManageEmployeeScreen';
import AddEmployeeScreen from './employee/AddEmployeeScreen';
import EditEmployeeScreen from './employee/EditEmployeeScreen';
import EmployeePermissionScreen from './employee/EmployeePermissionScreen';
import PatientProfile from './patients/PatientProfile';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN, selectUserToken } from './Redux/userSlice';
import { useEffect } from 'react';

import { SocketContext, socket } from './context/socket';
import CenterProfile from './center/CenterProfile';
import WebsiteSettingScreen from './setting/WebsiteSettingScreen';
import AppointmentHistory from './appointments/AppointmentHistory';
import Enquiry from './Enquiry';
import Partner from './components/Partner';
import ContactSetting from './setting/ContactSetting';
import Slots from './center/Slots';
import Testimonial from './components/Testimonial';
import Notification from './components/Notification';
import Gallery from './center/Gallery';
import Blogs from './components/Blogs';
import AddBlog from './components/Blogs/AddBlog';
import EditBlog from './components/Blogs/EditBlog';
import Chat from './components/Chat';
import PrivacyPolicy from './setting/PrivacyPolicy';
import AboutUs from './setting/AboutUs';
import CancelledAppointment from './appointments/CancelledAppointment';
import TodayAppointments from './appointments/TodayAppointments';
import CenterEnquiry from './components/CenterEnquiry';


function App() {

  const userToken = useSelector(selectUserToken)
  const dispatch = useDispatch()

  useEffect(() => {
    const activeEmp = localStorage.getItem('activeEmp');
    console.log("ACTIVE USER: ", activeEmp)

    if (activeEmp) {
      dispatch(LOGIN({ token: activeEmp }))
    }

  }, [])



  return (
    <SocketContext.Provider value={socket}>
    <div className="App">


      <Router basename="/admin/">

        {
          userToken == null ?
            <Switch>





              <Route path="/login">
                <Login />
              </Route>



              <Route path="/">
                <Login />
              </Route>



            </Switch>

            :

            <Switch>



              <Route path="/table">
                <Table />
              </Route>




              <Route path="/login">
                <Login />
              </Route>


              <Route path="/centreRequest">
                <CenterRequest />
              </Route>


              <Route path="/manageCentre">
                <ManageCenter />
              </Route>


              <Route path="/notifications">
                <Notification />
              </Route>

              <Route path="/addCentre">
                <AddCenterScreen />

              </Route>
              <Route path="/editCentre/:id">
                <EditCenterScreen />

              </Route>

              <Route path="/gallery/:id">
                <Gallery />

              </Route>
              <Route path="/centre/:centerId/slots">
                <Slots />

              </Route>


              <Route path="/managePatients">
                <PatientListScreen />

              </Route>

              <Route path="/manageTestimonials">
                <Testimonial />

              </Route>

              <Route path="/blogs">
                <Blogs />

              </Route>

              <Route path="/chats/:id?">
                <Chat />

              </Route>

              <Route path="/addBlog">
                <AddBlog />

              </Route>
              <Route path="/editBlog/:blogId">
                <EditBlog />

              </Route>

              <Route path="/manageEmployee">
                <ManageEmployeeScreen />

              </Route>

              <Route path="/addEmployee">
                <AddEmployeeScreen />
              </Route>
              <Route path="/editEmployee/:id">
                <EditEmployeeScreen />
              </Route>

              <Route path="/employeePermission/:id">
                <EmployeePermissionScreen />
              </Route>


              <Route path="/login">
                <Login />
              </Route>

              <Route path="/todayAppointments">
                <TodayAppointments />
              </Route>
              <Route path="/upcomingAppointments">
                <UpcomingAppointments />
              </Route>

              <Route path="/cancelledAppointments">
                <CancelledAppointment />
              </Route>

              <Route path="/appointmentHistory">
                <AppointmentHistory />
              </Route>

              <Route path="/contact-setting">
                <ContactSetting />
              </Route>

              <Route path="/partner">
                <Partner />
              </Route>

              <Route path="/enquiry">
                <Enquiry />
              </Route>

              <Route path="/centre-enquiry">
                <CenterEnquiry />
              </Route>



              <Route path="/centreProfile/:id">
                {/* <CenterProfileScreen /> */}
                <CenterProfile />

              </Route>




              <Route path="/dashboard">
                <Dashboard />
              </Route>



              <Route path="/patientProfile/:id">
                <PatientProfile />
              </Route>

              <Route path="/term-condition">
                <WebsiteSettingScreen />
              </Route>
              <Route path="/privacy-policy">
                <PrivacyPolicy />
              </Route>


              <Route path="/about-us">
                <AboutUs />
              </Route>



              {/* <Route path="/centreProfile/:id">
                <CenterProfile />
              </Route> */}

              {/* 
              <Route path="/xyz/:id">
                <CenterProfile />
              </Route> */}

              <Route path="/">
                <Dashboard />
              </Route>


            </Switch>
        }
      </Router>

      {/* <Login /> */}

      {/* <Table /> */}

      {/* <CenterRequest />
    <Dashboard /> */}

    </div>
    </SocketContext.Provider>
  );
}

export default App;
