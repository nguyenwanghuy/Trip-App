import axios from 'axios';
import { SetPosts } from '../redux/postSlice';

const API_URL = 'http://localhost:8001/trip';

export const API = axios.create({
  baseURL: API_URL,
  responseType: 'json',
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API({
      url: url,
      method: method || 'GET',
      data: data,
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
    });

    return result.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const refreshToken = () => async (dispatch, getState) => {
  try {
    const refreshToken = getState().user.refreshToken;
    if (refreshToken) {
      // Make an API request to refresh the access token using the refresh token
      const response = await apiRequest({
        url: '/auth/login', // Replace with your server's endpoint
        token: refreshToken,
        method: 'POST',
      });

      // Update the user and access token in the store
      if (response && response.accessToken) {
        dispatch(
          userSlice.actions.login({
            user: response.user,
            refreshToken,
            accessToken: response.accessToken,
          }),
        );
      }
    }
  } catch (error) {
    console.error('Token refresh failed', error);
  }
};

export const handleFileUpload = async (uploadFiles) => {
  if (!Array.isArray(uploadFiles)) {
    uploadFiles = [uploadFiles];
  }
  const uploadPromises = uploadFiles.map(async (uploadFile) => {
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('upload_preset', 'socialmedia');

    try {
      const response = await axios.post(
        `http://api.cloudinary.com/v1_1/dmlc8hjzu/image/upload/`,
        formData,
      );
      return response.data.secure_url;
    } catch (error) {
      console.log(error);
    }
  });

  // Wait for all uploads to complete
  const uploadedFileURLs = await Promise.all(uploadPromises);

  return uploadedFileURLs;
};

export const fetchPosts = async (token, dispatch, uri, data) => {
  console.log();
  try {
    const res = await apiRequest({
      url: uri || '/post',
      token: token,
      method: 'GET',
      data: data || {},
    });
    dispatch(SetPosts(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async ({ uri, token }) => {
  try {
    const res = await apiRequest({
      url: uri,
      token: token,
      method: 'POST',
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (id, token) => {
  try {
    const res = await apiRequest({
      url: '/post/' + id,
      token: token,
      method: 'DELETE',
    });
    return;
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (id, token) => {
  try {
    const uri = id === undefined ? '/user/' + id : '/user/' + id;

    const res = await apiRequest({
      url: uri,
      token: token,
      method: 'GET',
    });

    if (res.message === 'Authentication failed') {
      localStorage.removeItem('user');
      window.location.replace('/login');
    }
    return res.user;
  } catch (error) {
    console.log(error);
  }
};

export const searchUser = async (token, query) => {
  try {
    const res = await apiRequest({
      url: `/user/search/s?u=${query}`,
      token: token,
      method: 'GET',
    });
    return res;
  } catch (error) {
    logError(error);
    throw error;
  }
};
