import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { BsShare } from 'react-icons/bs';
import { ImConnection } from 'react-icons/im';
import { Button, Loading, TextInput } from '../components';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { AiOutlineInteraction } from 'react-icons/ai';
import { apiRequest } from '../utils';
import { userLogin } from '../redux/userSlice';

const Login = () => {
  const [show, setShow] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const handleShow = () => setShow(!show);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: '/auth/login',
        data: data,
        method: 'POST',
      });

      if (res?.status === 'failed') {
        setErrMsg(res.message);
      } else {
        setErrMsg('');
        const { token, ...payload } = res;
        dispatch(userLogin({ token, ...payload }));
        window.location.replace('/');
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-bgColor w-full h-[100vh] flex items-center justify-center p-6'>
      <div className='w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex bg-primary rounded-xl overflow-hidden shadow-xl'>
        {/* LEFT */}
        <div className='w-full lg:w-1/2 p-1 md:px-16 px-20  flex flex-col gap-2 justify-center '>
          <h2 className='font-bold text-2xl text-[#002D74]'>Login</h2>
          <p className='text-ascent-1 text-base font-semibold'>
            If you are already a member, easily log in
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              name='username'
              placeholder='Username'
              label='Username'
              type='text'
              register={register('username', {
                required: 'Email Address is required!',
              })}
              styles='rounded-md border w-full'
              labelStyle='ml-2'
              error={errors.user ? errors.user.message : ''}
            />

            <div className='relative'>
              <TextInput
                name='password'
                placeholder='Password'
                label='Password'
                type={show ? 'text' : 'password'}
                register={register('password', {
                  required: 'Password is required!',
                })}
                styles='rounded-md border w-full'
                labelStyle='ml-2'
                error={errors.password ? errors.password.message : ''}
              />

              <button
                onClick={handleShow}
                className=' absolute top-[3.2rem] right-3 -translate-y-1/2 text-ascent-2'
              >
                {show ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
              </button>
            </div>

            {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status == 'failed'
                    ? 'text-[#f64949fe]'
                    : 'text-[#2ba150fe]'
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <button
                className='bg-[#002D74] w-full rounded-md text-white py-2 mt-5  hover:scale-105 duration-300'
                type='submit'
              >
                Login
              </button>
            )}
          </form>
          <div className='mt-6 grid grid-cols-3 items-center text-gray-400'>
            <hr className='border-ascent-2' />
            <p className='text-center text-sm text-ascent-2'>OR</p>
            <hr className='border-ascent-2' />
          </div>
          <button className='bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]'>
            <svg
              className='mr-3'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 48 48'
              width='25px'
            >
              <path
                fill='#FFC107'
                d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
              />
              <path
                fill='#FF3D00'
                d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
              />
              <path
                fill='#4CAF50'
                d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
              />
              <path
                fill='#1976D2'
                d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
              />
            </svg>
            Login with Google
          </button>
          <Link
            to='/reset-password'
            className='text-xs border-b border-ascent-2 py-4 '
          >
            <span className='text-ascent-2'>Forgot your password?</span>
          </Link>
          <div className='mt-3 text-xs flex justify-between items-center '>
            <p className='text-ascent-2'>Don't have an account?</p>
            <Link to='/register'>
              <button className='py-2 px-5 bg-white border rounded-md hover:scale-110 duration-300'>
                Register
              </button>
            </Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className='hidden w-1/2 h-full lg:flex flex-col items-center justify-center '>
          <div className='relative w-full flex items-center justify-center'>
            <img
              src='https://e0.pxfuel.com/wallpapers/806/121/desktop-wallpaper-travel-with-air-balloons-iphone-7-lock-screen-iphone-7.jpg'
              alt='Bg Image'
              className='w-100 2xl:w-full h-100 2xl:h-full rounded-xl object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
