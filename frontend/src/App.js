import { Outlet, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, Login, Profile, Register, ResetPassword } from './pages';
import AuthenContext from './context/AuthContext/authContext';
import AuthState from './context/AuthContext/authState';
// import 'bootstrap/dist/css/bootstrap.min.css';

function Layout() {
  const { user } = useSelector((state) => state.user);
  // console.log(user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    // <AuthState>
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile/:id?' element={<Profile />} />
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
