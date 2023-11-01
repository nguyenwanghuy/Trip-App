import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(window?.localStorage.getItem('user')) ?? {},
  edit: false,
};
console.log(initialState)
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
      state.edit = action.payload;
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
