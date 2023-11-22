import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  albums: {},
};

const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    getAlbums(state, action) {
      state.posts = action.payload;
    },
  },
});

export default albumSlice.reducer;

export function SetAlbums(album) {
  return (dispatch, getState) => {
    dispatch(albumSlice.actions.getAlbums(album));
  };
}

// giống state