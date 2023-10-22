// import React, { useEffect, useState } from 'react';
// import AuthContext from './authContext';
// import axios from 'axios';
// import authAPI from '../../APIs/authApi';

// const AuthState = ({ children }) => {
//   const [auth, setAuth] = useState({
//     isAuthenticated: false,
//     user: {},
//   });
//   //call api

//   const fetchCurrent = async () => {
//     try {
//       const response = await authAPI.authInfo();
//       const data = response.data;
//       setAuth({
//         isAuthenticated: true,
//         user: data.userInfo,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const handleLogin = async () => {
//     await fetchCurrent();
//   };

//   const handleLogOut = () => {
//     setAuth({
//       isAuthenticated: false,
//       user: {},
//     });
//   };
//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     // call API/me => check token
//     if (accessToken) {
//       fetchCurrent();
//     }
//   }, []);
//   return (
//     <AuthContext.Provider
//       value={{
//         auth,
//         handleLogin,
//         handleLogOut,
//         fetchCurrent,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthState;
