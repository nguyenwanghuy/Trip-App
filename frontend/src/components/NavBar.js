import React, { useContext, useState, useEffect } from 'react';
import { TbSocial } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { TextInput, CustomButton } from './index';
import { useForm } from 'react-hook-form';
import { BsMoon, BsSunFill } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { SetTheme } from '../redux/theme';
import { userLogout } from '../redux/userSlice';
import NoProfile from '../assets/NoProfile.jpg';
import { apiRequest, fetchPosts, searchUser } from '../utils';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);

  const handleTheme = () => {
    const themeValue = theme === 'light' ? 'dark' : 'light';
    dispatch(SetTheme(themeValue));
  };

  const setSearch = async () => {
    try {
      const res = await apiRequest({
        url: `/user/search/s?u=${query}`,
        token: user.token,
        method: 'GET',
      });
      console.log(res);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch();
    navigate(`/trip/user/search/s/${query}`);
  };

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-3 px-4 bg-primary'>
      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white font-extrabold text-xl'>
          TS
        </div>
        <span className='text-xxl font-bold text-slate-400'>TripSocial</span>
      </Link>

      <form
        className='hidden md:flex items-center justify-center'
        onSubmit={handleSearch}
      >
        <Input
          type='text'
          placeholder='Search...'
          className='w-[18rem] lg:w-[38rem] rounded-l-xl rounded-r-none py-3 text-ascent-2 text-sm '
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <CustomButton
          title='Search'
          type='submit'
          containerStyles='bg-[#0444a4] text-white px-6 py-[0.66rem]  rounded-r-xl'
        />
      </form>

      {/* ICONS */}
      <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl'>
        <button onClick={() => handleTheme()}>
          {theme ? <span>Light</span> : <span>Dark</span>}
        </button>
        <div className='hidden lg:flex'>
          <IoMdNotificationsOutline />
        </div>

        <CustomButton
          onClick={() => dispatch(userLogout())}
          title='Log Out'
          containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'
        />
        <div className='flex items-center justify-between gap-4'>
          <img src={user.userInfo.avatar} className='w-11 h-11 rounded-full' />
          <span className='text-sm'>{user.userInfo.username}</span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
