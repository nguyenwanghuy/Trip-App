import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(window?.localStorage.getItem('user')) ?? {},
  edit: false,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage?.removeItem('user');
    },
    updateProfile(state, action) {
      state.user.avatar = action.payload.avatar;
      state.edit = action.payload.edit;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});
export default userSlice.reducer;

export function userLogin(user) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.login(user));
  };
}

export function userLogout() {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.logout());
  };
}

export function updateProfile(val) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.updateProfile(val));
  };
}
