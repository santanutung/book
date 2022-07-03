// import axios from "axios"
// import { env } from "./env"

// let headers= {}

// if( localStorage.getItem('activeCenter') != null)
// {
//     headers.authentication = `Bearer ${localStorage.getItem('activeCenter')}`
// }

// export default axios.create({

//     baseURL: env.baseUrl,
//     headers
// })

import axios from "axios"
import { env } from "./env"

var headers = {}

const axiosBaseUrl =  axios.create({
    baseURL: env.baseUrl,
    headers 
})


// Add a request interceptor
axiosBaseUrl.interceptors.request.use(async function (config) {
    // Do something before request is sent

    Object.assign(config.headers, {testHeader: "This is the tes header"})
    
    try {
        const user = await localStorage.getItem('activeCenter');

        if (user !== null) {
          // console.log("HERE IN AXIOS BASE URL: ", user)

            Object.assign(config.headers, {authentication: "Bearer " + user})
        }
    }
    catch (err) {
        // error reading value
        console.log("Err while fetching: ", err)
    }
    
    // console.log(config.headers)

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

