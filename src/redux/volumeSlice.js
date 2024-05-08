import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentVolume: 0,
  isMuted: true,
};

export const volumeSlice = createSlice({
  name: 'volume',
  initialState,
  reducers: {
    changeVolume: (state, action) => {
      state.currentVolume = action.payload;
      state.isMuted = action.payload === 0;
    },
    setMuted: (state, action) => {
      state.isMuted = action.payload;
    },
    resetVolumeState: (state, action) => {
      state.currentVolume = initialState.currentVolume;
      state.isMuted = initialState.isMuted;
    },
  },
});

export const { changeVolume, setMuted, resetVolumeState } = volumeSlice.actions;

export default volumeSlice.reducer;
