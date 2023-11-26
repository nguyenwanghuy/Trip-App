import React, { useState, useEffect } from 'react';
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFillAdd,
} from 'react-icons/bs';
import { CiLocationOn } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest, handleFileUpload } from '../../utils';
import { updateProfile, userLogin } from '../../redux/userSlice';
import EditProfileForm from '../Modal/EditProfile';
import { LiaEditSolid, LiaBirthdayCakeSolid } from 'react-icons/lia';
import { FaTwitterSquare } from 'react-icons/fa';
import { PiGenderIntersex, PiFinnTheHuman } from 'react-icons/pi';
import { Button } from 'antd';
import { MdDateRange, MdOutlineDescription, MdWork } from 'react-icons/md';

import moment from 'moment';
const IntroduceProfile = ({ userInfo, fetchUserData }) => {
  const { user, user: data } = useSelector((state) => state.user);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState(null);

  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg('');

    try {
      const uri = picture && (await handleFileUpload(picture));
      const {
        avatar,
        fullname,
        age,
        dateOfBirth,
        gender,
        description,
        location,
        profession,
      } = data;

      const res = await apiRequest({
        url: `/auth/me/profile/${user?._id}`,
        data: {
          fullname,
          age,
          dateOfBirth,
          gender,
          description,
          location,
          profession,
          avatar: uri ? uri : user.avatar,
        },
        method: 'PUT',
        token: user.token,
      });

      if (res?.status === 'failed') {
        setErrMsg(res);
      } else {
        setErrMsg(res);

        const newUser = {
          token: user.token,
          ...user.userInfo,
          ...res.updateMeProfile,
        };
        dispatch(userLogin(newUser));
        setIsModalVisible(false);
        fetchUserData();
      }
      setIsSubmitting(false);
    } catch (error) {
      // console.log(error);
      setIsSubmitting(false);
    }
  };

  const openProfileModal = () => {
    setIsModalVisible(true);
    dispatch(updateProfile({ edit: true }));
  };

  const handleOk = () => {
    dispatch(updateProfile({ edit: false }));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    dispatch(updateProfile({ edit: false }));
    setIsModalVisible(false);
  };
  //format day
  const formatDateOfBirth = moment(userInfo.dateOfBirth).format('DD-MM-YYYY');
  // console.log(userInfo);
  return (
    <div className='bg-primary px-4 py-4 rounded-md shadow-lg'>
      <div className='w-full flex flex-col gap-2 py-4  '>
        <div className=''>
          {user._id === userInfo?._id && (
            <Button
              className='flex gap-2 border-none'
              onClick={() => {
                dispatch(updateProfile(true));
                setIsModalVisible(true);
              }}
            >
              <LiaEditSolid size={22} className='text-blue cursor-pointer' />
              Update your profile
            </Button>
          )}
        </div>

        <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645] '>
          {/* fullname */}
          <div className='flex gap-2 items-center text-ascent-2'>
            <PiFinnTheHuman className='text-xl text-ascent-1' />
            <span>{userInfo.fullname} </span>
          </div>
          {/* age */}
          <div className='flex gap-2 items-center text-ascent-2'>
            <MdDateRange className='text-xl text-ascent-1' />
            <span>{userInfo.age} tuổi </span>
          </div>
          {/* date of birth */}
          <div className='flex gap-2 items-center text-ascent-2'>
            <LiaBirthdayCakeSolid className=' text-lg text-ascent-1' />
            <span>{formatDateOfBirth}</span>
          </div>
          {/* gender */}
          <div className='flex gap-2 items-center text-ascent-2'>
            <PiGenderIntersex className='text-xl text-ascent-1' />
            <span>{userInfo.gender}</span>
          </div>
          {/* descip */}
          <div className='flex gap-2 items-center text-ascent-2'>
            <MdOutlineDescription className='text-xl text-ascent-1' />
            <span>{userInfo.description}</span>
          </div>
          {/* location */}
          <div className='flex gap-2 items-center text-ascent-2'>
            <CiLocationOn className='text-xl text-ascent-1' />
            <span>{userInfo.location}</span>
          </div>
          {/* profession */}
          <div className='flex gap-2 items-center text-ascent-2'>
            <MdWork className='text-xl text-ascent-1' />
            <span>{userInfo.profession}</span>
          </div>
        </div>

        {/* Social Profiles */}
        <div className='w-full flex flex-col gap-4 py-4 pb-6'>
          <p className='text-ascent-1 text-lg font-semibold'>Social Profile</p>

          <div className='flex gap-2 items-center text-ascent-2'>
            <BsInstagram className=' text-xl text-ascent-1' />
            <span>Instagram</span>
          </div>

          <div className='flex gap-2 items-center text-ascent-2'>
            <FaTwitterSquare className=' text-xl text-ascent-1' />
            <span>Twitter</span>
          </div>

          <div className='flex gap-2 items-center text-ascent-2'>
            <BsFacebook className=' text-xl text-ascent-1' />
            <span>Facebook</span>
          </div>
        </div>
      </div>
      {/* Modal */}
      <EditProfileForm
        isVisible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        errMsg={errMsg}
      />
    </div>
  );
};

export default IntroduceProfile;
