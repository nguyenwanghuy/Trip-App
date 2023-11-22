import { Outlet, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Home, Login, Profile, Register, ResetPassword, Search } from './pages';
import { userLogin } from './redux/userSlice';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Album from './components/details/ImageDetails/Album';
import Avatar from './components/details/ImageDetails/Avatar';
import PostDetail from './components/Post/PostDetail';

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const refreshToken = async () => {
    try {
      const res = axios.post('http://localhost:8001/trip/auth/refresh', {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  let axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(user?.token);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          token: data.token,
        };
        dispatch(userLogin(refreshUser));
        config.headers['token'] = data.token;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    },
  );

  return (
    // <AuthState>
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/trip/user/:id?' element={<Profile />} />
          <Route path='/trip/user/search/s/:query' element={<Search />} />
          <Route path='/trip/create-album' element={<Album/>} />
          <Route path='/trip/sh-avatar' element={<Avatar/>} />
          <Route path='/trip/post/:id' element={<PostDetail />} />
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
    // </AuthState>
  );
}

export default App;
