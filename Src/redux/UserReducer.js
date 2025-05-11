import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userid: null,
    token: null,
    isLoggedIn: false,
    email: null,
    name: null,
    phoneno: null,
    pushToken: null,
    notificationsEnabled: false,
    
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userid = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setemail: (state, action) => {
      state.email = action.payload;
    },
    setname: (state, action) => {
      state.name = action.payload;
    },
    setphoneno: (state, action) => {
      state.phoneno = action.payload;
    },
    setPushToken: (state, action) => {
      state.pushToken = action.payload;
    },
    setNotificationsEnabled: (state, action) => {
      state.notificationsEnabled = action.payload;
    },
    
    clearUser: (state) => {
      state.userid = null;
      state.token = null;
      state.isLoggedIn = false;
      state.email = null;
      state.name = null;
      state.phoneno = null;
      state.pushToken = null;
      state.notificationsEnabled = false;
    },
  },
});

export const {
  setUserInfo,
  setToken,
  setIsLoggedIn,
  setemail,
  setname,
  setphoneno,
  setPushToken,
  setNotificationsEnabled,
  clearUser,
} = userSlice.actions;
export default userSlice.reducer;