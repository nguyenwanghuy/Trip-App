import { combineReducers } from '@reduxjs/toolkit';

import userSlice from './userSlice';
import themeSlice from './theme';
import postSlice from './postSlice';
import albumSlice from './albumSlice';

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
  album: albumSlice,
});

export { rootReducer };
