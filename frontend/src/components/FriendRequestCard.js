import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CustomButton } from '../components';

const FriendRequests = ({ friendRequest, handleAcceptFriendRequest }) => {
  return (
    <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
      <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
        <span> Friend Request</span>
        <span>{friendRequest?.length}</span>
      </div>
      <div className='w-full flex flex-col gap-4 pt-4'>
        {friendRequest?.map(({ _id, requestFrom: from }) => (
          <div key={_id} className='flex items-center justify-between'>
            <Link
              to={'/trip/user/' + from._id}
              className='w-full flex gap-4 items-center cursor-pointer'
            >
              <img
                src={from?.avatar}
                alt={from?.username}
                className='w-10 h-10 object-cover rounded-full'
              />
              <div className='flex-1'>
                <p className='text-base font-medium text-ascent-1'>
                  {from?.username}
                </p>
              </div>
            </Link>

            <div className='flex gap-1'>
              <CustomButton
                title='Accept'
                containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                onClick={() => handleAcceptFriendRequest(_id, 'Accepted')}
              />
              <CustomButton
                title='Deny'
                containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                onClick={() => handleAcceptFriendRequest(_id, 'Denied')}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
