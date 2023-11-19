import axios from 'axios';
import { SetPosts } from '../redux/postSlice';
import axiosJWT from "../pages/Home"
const API_URL = 'http://localhost:8001/trip';

export const API = axios.create({
  baseURL: API_URL,
  responseType: 'json',
});

export const apiRequest = async ({ url, token, data, method , axiosJWT }) => {
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

export const handleFileUpload = async (uploadFiles) => {
  if (!Array.isArray(uploadFiles)) {
    uploadFiles = [uploadFiles]; // Chuyển đổi thành mảng nếu không phải mảng
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

// export const handleFileUpload = async (uploadFile) => {
//   const formData = new FormData();
//   formData.append('file', uploadFile);
//   formData.append('upload_preset', 'socialmedia');
//   console.log(formData);

//   try {
//     const response = await axios.post(
//       `http://api.cloudinary.com/v1_1/dmlc8hjzu/image/upload/`,
//       formData,
//     );
//     return response.data.secure_url;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const fetchPosts = async (token, dispatch, uri, data,axiosJWT) => {
 console.log()
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

export const viewUserProfile = async (token, id) => {
  try {
    const res = await apiRequest({
      url: '/user/',
      token: token,
      method: 'POST',
      data: { id },
    });
    return;
  } catch (error) {
    console.log(error);
  }
};
