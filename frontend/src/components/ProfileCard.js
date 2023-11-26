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
import { PiGenderIntersex } from 'react-icons/pi';

const ProfileCard = ({ user }) => {
  const hasUserDetails =
    user?.location ||
    user?.profession ||
    user.userInfo?.dateOfBirth ||
    user.userInfo?.gender ||
    (user.socialProfiles && Object.keys(user.socialProfiles).length > 0);
  return (
    <div>
      <div className='w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4 '>
        {/* Header */}
        <div className='w-full flex items-center justify-between border-b pb-5 border-[#66666645]'>
          <Link to={'/trip/user/' + user._id} className='flex gap-2'>
            <img
              src={user.avatar}
              alt={user?.username}
              className='w-14 h-14 object-cover rounded-full'
            />
            <div className='flex flex-col justify-center'>
              <p className='text-lg font-medium text-ascent-1'>
                {user.username} 
              </p>
              {user.userInfo?.profession && (
                <span className='text-ascent-2'>{user?.profession}</span>
              )}
            </div>
          </Link>
        </div>

        {/* User Details */}
        {hasUserDetails && (
          <div className='w-full flex flex-col gap-2 py-4 border-b border-[#66666645] '>
            {user?.location && (
              <div className='flex gap-2 items-center text-ascent-2'>
                <CiLocationOn className='text-xl text-ascent-1' />
                <span>{user?.location}</span>
              </div>
            )}

            {user?.profession && (
              <div className='flex gap-2 items-center text-ascent-2'>
                <BsBriefcase className=' text-lg text-ascent-1' />
                <span>{user.profession}</span>
              </div>
            )}

            {user.dateOfBirth && (
              <div className='flex gap-2 items-center text-ascent-2'>
                <LiaBirthdayCakeSolid className=' text-lg text-ascent-1' />
                <span>{user?.dateOfBirth}</span>
              </div>
            )}

            {user.gender && (
              <div className='flex gap-2 items-center text-ascent-2'>
                <PiGenderIntersex className='text-xl text-ascent-1' />
                <span>{user?.gender}</span>
              </div>
            )}
          </div>
        )}

        {/* Social Profiles */}
        {hasUserDetails &&
          user.socialProfiles &&
          Object.keys(user.socialProfiles).length > 0 && (
            <div className='w-full flex flex-col gap-4 py-4 pb-6'>
              <p className='text-ascent-1 text-lg font-semibold'>
                Social Profile
              </p>

              {user.socialProfiles.instagram && (
                <div className='flex gap-2 items-center text-ascent-2'>
                  <BsInstagram className=' text-xl text-ascent-1' />
                  <span>Instagram</span>
                </div>
              )}

              {user.socialProfiles.twitter && (
                <div className='flex gap-2 items-center text-ascent-2'>
                  <FaTwitterSquare className=' text-xl text-ascent-1' />
                  <span>Twitter</span>
                </div>
              )}

              {user.socialProfiles.facebook && (
                <div className='flex gap-2 items-center text-ascent-2'>
                  <BsFacebook className=' text-xl text-ascent-1' />
                  <span>Facebook</span>
                </div>
              )}
            </div>
          )}

        {/* Display "No Information" if no user details */}
        {!hasUserDetails && (
          <div className='text-ascent-2 text-lg'>No Information</div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
