import React from 'react';
import { TbSocial } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { TextInput, Button } from './index';
import { useForm } from 'react-hook-form';
import { BsMoon, BsSunFill } from 'react-icons/bs';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { SetTheme } from '../redux/theme';
import { Logout, userLogout } from '../redux/userSlice';
import NoProfile from '../assets/NoProfile.jpg';
// import { user } from '../assets/data';

const NavBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === 'light' ? 'dark' : 'light';

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {};

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py-3 px-4 bg-primary'>
      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2 bg-[#065ad8] rounded text-white font-extrabold text-xl'>
          TS
        </div>
        <span className='text-xl md:text-2xl text-[#065ad8] font-semibold'>
          TripSocial
        </span>
      </Link>

      <form
        className='hidden md:flex items-center justify-center'
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder='Search...'
          styles='w-[18rem] lg:w-[38rem] rounded-l-xl rounded-r-none py-3 '
          register={register('search')}
        />
        <Button
          title='Search'
          type='submit'
          containerStyles='bg-[#0444a4] text-white px-6 py-[0.7rem] mt-2 rounded-r-xl'
        />
      </form>

      {/* ICONS */}
      <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl'>
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <div className='hidden lg:flex'>
          <IoMdNotificationsOutline />
        </div>

        <div>
          <Button
            onClick={() => dispatch(userLogout())}
            title='Log Out'
            containerStyles='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full'
          />
        </div>
        <div className='flex items-center justify-between gap-4'>
          <img src={NoProfile} className='w-11 h-11 rounded-full' />
          <span className='text-sm'>
            {user.username} {user.lastName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
