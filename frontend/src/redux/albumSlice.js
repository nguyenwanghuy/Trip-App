import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  albums: {},
};

const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    getAlbums(state, action) {
      state.albums = action.payload;
    },
  },
});
export default albumSlice.reducer;

export function SetAlbums(album) {
  return (dispatch) => {
    dispatch(albumSlice.actions.getAlbums(album));
  };
}
