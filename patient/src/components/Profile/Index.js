import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosBaseUrl from '../../axiosBaseUrl';
import useGlobalContexts from '../../context/GlobalContext';
import Layout from '../Layout';
import Appointment from './Appointment/Index';
import DesktopProfile from './DesktopProfile';
import Enquiry from './Enquiry';
import Family from './Family/Index';
import MobileProfile from './MobileProfile';
import Report from './Report';
import Review from './Review';

function Profile() {

    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
          
        //   alert(totalDate)
        setSize([window.innerWidth, window.innerHeight]);
        getSize()
        // console.log(window.innerWidth+""+ window.innerHeight)
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
   
  
    function getSize() {
        setSize([window.innerWidth, window.innerHeight]);
        console.log(window.innerWidth+""+ window.innerHeight)
    }

    useEffect(() => {
      
        getSize()
       
    }, [])

    return (


        <>
        {size[0] > 1213 ?<DesktopProfile /> : <MobileProfile /> }
            
        </>
       );
}

export default Profile;
