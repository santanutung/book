import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserToken } from './Redux/userSlice'

// export const sendUser = (user) => {
//     return user
// }
function UserToken() {
    const userToken = useSelector(selectUserToken)
    console.log(userToken)
    // sendUser(userToken)
}

export default UserToken
