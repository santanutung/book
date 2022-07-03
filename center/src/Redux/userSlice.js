
import { createSlice } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";
export const userSlice = createSlice({
  name: 'user',

  initialState: {
    username: "test_09",  //"default__user"
    userToken: null,
    centerId: null,
    centerName: null
  },

  reducers: {

    LOGIN: (state, action) => {
      state.userToken = action.payload.userToken
      var decoded = jwt_decode(action.payload.userToken);
      state.centerId = decoded.centerId
      state.centerName = decoded.name
      console.log(decoded, "decorder");
    },

    LOGOUT: (state, action) => {
      state.userToken = null
      state.centerId = null
      state.centerName = null
    },




  }
});




export const { LOGIN, LOGOUT } = userSlice.actions;

// Selector
export const selectUserName = (state) => state.user.username;
export const selectUserToken = (state) => state.user.userToken;
export const selectCenterId = (state) => state.user.centerId;
export const selectCenterName = (state) => state.user.centerName;

export default userSlice.reducer;