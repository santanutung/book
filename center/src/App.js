import { useEffect } from 'react';
import './App.css';
import LoginScreen from './components/LoginScreen';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
// import HomeScreen from './components/HomeScreen';
import { useDispatch, useSelector } from 'react-redux';
import { LOGIN, selectUserToken } from './Redux/userSlice';
import Dashboard1 from './components/Dashboard1';
import UpcomingAppointments from './components/appointments/UpcomingAppointments';
import AppointmentHistory from './components/appointments/AppointmentHistory';
import PatientScreen from './components/patients/PatientScreen';
import PatientProfile from './components/patients/PatientProfile';
import Profile from './components/center/Profile';
import Stats from './components/center/Stats';
import AppointmentSlots from './components/appointments/AppointmentSlots';
import BookAppointmentScreen from './components/appointments/BookAppointmentScreen';
import Review from './components/Review';
import DateSlots from './components/appointments/Slots/DateSlots';
import Gallery from './components/center/Gallery';
import {SocketContext, socket} from './context/socket';
import Notification from './components/Notification';
import CancelAppointments from './components/appointments/CancelAppointments';
import OfflineAppointment from './components/appointments/OfflineAppointment';
import Enquiry from './components/Enquiry';

// import firebase, { getToken } from './firebase'

function App() {


  // useEffect(() => {

  //   axiosBaseUrl.get('api/category')
  //     .then((res) => console.log("HELLO"))
  //     .catch((err) => console.log("Err: ", err))

  // }, [])

  const userToken = useSelector(selectUserToken)
  const dispatch = useDispatch()
  // const [isTokenFound, setTokenFound] = useState(false);

  // console.log("Token found", isTokenFound);


  useEffect(() => {

  

    const activeCenter = localStorage.getItem('activeCenter');
    console.log("ACTIVE USER: ", activeCenter)

    if (activeCenter) {
      dispatch(LOGIN({ userToken: activeCenter }))
    }

  }, [])



  return (
    <SocketContext.Provider value={socket}>
    <div className="App">

      <Router basename="/centre/">

        {
          userToken == null ?
            <Switch>


              <Route path="/login">
                <LoginScreen />
              </Route>



              <Route path="/">
                <LoginScreen />
              </Route>



            </Switch>

            :
            <Switch>



              <Route path="/appointmentSlot">
                <AppointmentSlots />
              </Route>

              <Route path="/manageSlots">
                <DateSlots />
              </Route>

              <Route path="/gallery">
                <Gallery />
              </Route>

              <Route path="/notifications">
                <Notification />
              </Route>







              <Route path="/patients">
                <PatientScreen />
              </Route>


              <Route path="/upcomingAppointments">
                <UpcomingAppointments />
              </Route>


              <Route path="/dashboard">
                <Dashboard1 />
              </Route>


              <Route path="/appointmentHistory">
                <AppointmentHistory />
              </Route>
              <Route path="/cancelledAppointment">
                <CancelAppointments />
              </Route>
              <Route path="/offlineAppointment">
                <OfflineAppointment />
              </Route>

              <Route path="/stats">
                <Stats />
              </Route>

              <Route path="/enquiry">
                <Enquiry />
              </Route>

              <Route path="/bookAppointment">
                <BookAppointmentScreen />
              </Route>

              <Route path="/reviews">
                <Review />
              </Route>


              <Route path="/profiles">
                <Profile />
              </Route>

              <Route path="/patientProfile/:id">
                <PatientProfile />
              </Route>

              <Route path="/">
                <Dashboard1 />
              </Route>


            </Switch>

        }
      </Router>

    </div>
    </SocketContext.Provider>
  );
}

export default App;
