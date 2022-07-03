
import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";

export const userSlice = createSlice({
  name: 'user',

  initialState: {
    userToken: null,
    usename: "abc",
    updateStatus : false,
    userId : ''
  },

  reducers: {

    LOGIN: (state, action) => {
      state.userToken = action.payload.token

      var decoded = jwt_decode(action.payload.token);
      state.userId = decoded.userId
      // setUserId(decoded.userId)
    },

    LOGOUT: (state, action) => {
      state.userToken = null
      state.userId = null
    },

    ACTIVE_USER: (state, action) => {
      state.usename = "himanshu"
    },

    UPDATESTATUS: (state, action) => {
      state.updateStatus = action.payload.sttaus
    },
   

  }
});



export const { LOGIN, LOGOUT, ACTIVE_USER } = userSlice.actions;

// Selector
export const selectUserToken = (state) => state.user.userToken;
export const selectUserName = (state) => state.user.usename;

export const selectUserId = (state) => state.user.userId;


export default userSlice.reducer;