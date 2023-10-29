import axiosInstance from './axiosInstance';

const authAPI = {
  login: (values) => axiosInstance.post('/auth/login', values),
  register: (values) => axiosInstance.post('/auth/register', values),
  authInfo: () => axiosInstance.get('/auth/me'),
  searchUser: (values) => axiosInstance.get(`/users?fullname=${values}`),
  createPost: (values) => axiosInstance.post('/post', values),
  getAllPosst: () => axiosInstance.get('/post'),
  deletePost: (postId) => axiosInstance.delete(`/post/${postId}`),
  searchText: (values) => axiosInstance.get(`/post/search?title=${values}`),
  createComment: (values) => axiosInstance.post('/comment', values),
  getAllComments: () => axiosInstance.get('/comment'),
  getAllVideos: () => axiosInstance.get('/video'),
  addVideo: (values) => axiosInstance.post('/video/upload', values),
};

export default authAPI;
