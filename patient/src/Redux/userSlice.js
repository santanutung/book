
import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";
export const userSlice = createSlice({
  name: 'user',

  initialState: {
    username: "test_09",  //"default__user"
    userToken: null,
    selectedAppointmentSlot: null,  
    userId: null
  },

  reducers: {

    LOGIN: (state, action) => {
      state.userToken = action.payload.userToken
  
    },

    LOGOUT: (state, action) => {
      state.userToken = null
      state.userId = null
    },

    SELECTSLOT: (state, action) => {
      state.selectedAppointmentSlot = action.payload.selectedAppointmentSlot
    },


  }
});




export const { LOGIN, LOGOUT, SELECTSLOT } = userSlice.actions;

// Selector
export const selectUserName = (state) => state.user.username;
export const selectUserToken = (state) => state.user.userToken;
export const selectedAppointmentSlot = (state) => state.user.selectedAppointmentSlot;
export const selectUserId = (state) => state.user.userId;
export default userSlice.reducer;