import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = '';
    },
    followClick: (state, action) => {
      if (state.currentUser.following.includes(action.payload[0])) {
        state.currentUser.following.splice(
          state.currentUser.following.findIndex((userId) => userId === action.payload[0]),
          1,
        );
      } else {
        state.currentUser.following.push(action.payload[0]);
      }
    },
    updateUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, followClick, updateUser } =
  userSlice.actions;

export default userSlice.reducer;
