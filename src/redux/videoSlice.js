import { createSlice } from '@reduxjs/toolkit';

import { followClick } from './userSlice';

const initialState = {
  currentVideo: null,
  loading: false,
  error: '',
};

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.currentVideo = action.payload;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetVideo: (state) => {
      state.currentVideo = null;
      state.loading = false;
      state.error = '';
    },
    likeClick: (state, action) => {
      if (!state.currentVideo.likes.includes(action.payload)) {
        state.currentVideo.likes.push(action.payload);
        state.currentVideo.likesCount++;
        state.currentVideo.user.likesCount++;
      } else {
        state.currentVideo.likes.splice(
          state.currentVideo.likes.findIndex((userId) => userId === action.payload),
          1,
        );
        state.currentVideo.likesCount--;
        state.currentVideo.user.likesCount--;
      }
    },
    favoriteClick: (state, action) => {
      if (!state.currentVideo.favorites.includes(action.payload)) {
        state.currentVideo.favorites.push(action.payload);
        state.currentVideo.favoritesCount++;
        state.currentVideo.user.favoritesCount++;
      } else {
        state.currentVideo.favorites.splice(
          state.currentVideo.favorites.findIndex((userId) => userId === action.payload),
          1,
        );
        state.currentVideo.favoritesCount--;
        state.currentVideo.user.favoritesCount--;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(followClick, (state, action) => {
      if (state.currentVideo) {
        if (state.currentVideo.user.followers.includes(action.payload[1])) {
          state.currentVideo.user.followers.splice(
            state.currentVideo.user.followers.findIndex((userId) => userId === action.payload[1]),
            1,
          );
          state.currentVideo.user.followersCount--;
        } else {
          state.currentVideo.user.followers.push(action.payload[1]);
          state.currentVideo.user.followersCount++;
        }
      }
    });
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, resetVideo, likeClick, favoriteClick } =
  videoSlice.actions;

export default videoSlice.reducer;
