
import axios from "axios"
import { env } from "./env"

var headers = {
    'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',

}

const axiosBaseUrl =  axios.create({
    baseURL: env.baseUrl,
    headers 
})


// Add a request interceptor
axiosBaseUrl.interceptors.request.use(async function (config) {

    try {
        const user = await localStorage.getItem('activeUser');

        if (user !== null) {
  
            Object.assign(config.headers, {authentication: "Bearer " + user})
        }
    }
    catch (err) {
        // error reading value
        console.log("Err while fetching: ", err)
    }
    
 

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axiosBaseUrl.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });


  

export default axiosBaseUrl

