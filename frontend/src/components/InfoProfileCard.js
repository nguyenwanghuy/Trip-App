import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LiaEditSolid } from 'react-icons/lia';
import {
  BsBriefcase,
  BsFacebook,
  BsInstagram,
  BsPersonFillAdd,
} from 'react-icons/bs';
import { FaTwitterSquare } from 'react-icons/fa';
import { CiLocationOn } from 'react-icons/ci';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { PiGenderIntersex ,PiFinnTheHuman} from 'react-icons/pi';
import { MdDateRange,MdOutlineDescription,MdWork} from "react-icons/md";
import moment from 'moment';
const InfoProfileCard = ({ user }) => {
  // console.log(user);
  const hasUserDetails =
    user?.fullname || user?.age || user.dateOfBirth || user.gender || user.description || user.location || user.profession;
 //format day
 const formatDateOfBirth =moment(user.dateOfBirth).format("DD-MM-YYYY")
  return (
    <div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4'>
      {hasUserDetails && (
        <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645] '>
          {user?.fullname && (
            <div className='flex gap-2 items-center text-ascent-2'>
              <PiFinnTheHuman className='text-xl text-ascent-1' />
              <span>{user.fullname}</span>
            </div>
          )}

          {user?.age && (
            <div className='flex gap-2 items-center text-ascent-2'>
              <MdDateRange className=' text-lg text-ascent-1' />
              <span>{user.age} tuổi</span>
            </div>
          )}

          {user.dateOfBirth && (
            <div className='flex gap-2 items-center text-ascent-2'>
              <LiaBirthdayCakeSolid className=' text-lg text-ascent-1' />
              <span>{formatDateOfBirth}</span>
            </div>
          )}

          {user.gender && (
            <div className='flex gap-2 items-center text-ascent-2'>
              <PiGenderIntersex className='text-xl text-ascent-1' />
              <span>{user.gender}</span>
            </div>
          )}
           {user.description && (
            <div className='flex gap-2 items-center text-ascent-2'>
              <MdOutlineDescription className='text-xl text-ascent-1' />
              <span>{user.description}</span>
            </div>
          )}
           {user.location && (
            <div className='flex gap-2 items-center text-ascent-2'>
              <CiLocationOn className='text-xl text-ascent-1' />
              <span>{user.location}</span>
            </div>
          )}
           {user.profession && (
            <div className='flex gap-2 items-center text-ascent-2'>
              <MdWork className='text-xl text-ascent-1' />
              <span>{user.profession}</span>
            </div>
          )}

        </div>
      )}
      {!hasUserDetails && (
        <div className='text-ascent-2 text-lg'>No Information</div>
      )}

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
          <span>Facebook </span>
        </div>
      </div>

      {/* Display "No Information" if no user details */}
    </div>
  );
};

export default InfoProfileCard;
