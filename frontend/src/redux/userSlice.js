import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(window?.localStorage.getItem('user')) || {},
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
      state.user = {};
      state.edit = false;
      localStorage?.removeItem('user');
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
      state.edit = action.payload.edit;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export default userSlice.reducer;

export const { login, logout, updateProfile } = userSlice.actions;

export const userLogin = (user) => (dispatch) => {
  dispatch(login(user));
};

export const userLogout = () => (dispatch) => {
  dispatch(logout());
};

export const updateUserProfile = (updatedUser) => (dispatch) => {
  dispatch(updateProfile(updatedUser));
};
