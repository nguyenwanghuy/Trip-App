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
        'content-type': 'application/json',
      },
    });
    return result.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append('file', uploadFile);
  formData.append('upload_preset', 'socialmedia');
  console.log(formData);

  try {
    const response = await axios.post(
      `http://api.cloudinary.com/v1_1/dmlc8hjzu/image/upload/`,
      formData,
    );
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const fetchPosts = async (token, dispatch, uri, data) => {
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
