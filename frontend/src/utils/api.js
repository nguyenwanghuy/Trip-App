import axios from 'axios';
import { userLogin } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
  async (config) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const refreshedToken = await refreshToken(user, dispatch);

    if (refreshedToken) {
      config.headers['x-access-token'] = refreshedToken; // Corrected the typo in header key
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

const refreshToken = async (user, dispatch) => {
  try {
    const res = await axios.post('http://localhost:8001/trip/auth/refresh', {
      withCredentials: true,
    });

    const date = new Date();
    const decodedToken = jwtDecode(user?.token);

    if (decodedToken.exp < date.getTime() / 1000) {
      const refreshUser = {
        ...user,
        token: res.token,
      };

      dispatch(userLogin(refreshUser));

      return res.token;
    }

    return user.token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { axiosJWT, refreshToken };
