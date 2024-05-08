import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLightTheme: true,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.isLightTheme = !state.isLightTheme;
    },
  },
});

export const { changeTheme } = themeSlice.actions;

export default themeSlice.reducer;
