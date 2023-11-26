import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendFriendRequest } from '../../utils';
import { useSelector } from 'react-redux';
import { BsPersonFillAdd } from 'react-icons/bs';

const FriendsProfile = (userInfo) => {
  const { user } = useSelector((state) => state.user);

  if (!userInfo.userInfo.friends || !Array.isArray(userInfo.userInfo.friends)) {
    return <p>No friends data available</p>;
  }

  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user.token, id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='grid grid-cols-2 gap-4 bg-primary rounded-lg px-4 py-4 mt-4 shadow text-ascent-1'>
      {userInfo.userInfo.friends.map((userFriend) => (
        <div
          className='flex items-center justify-between border px-2 py-2 border-[#66666690] rounded-lg'
          key={userFriend._id}
        >
          <Link to={`/trip/user/${userFriend._id}`}>
            <div className='flex items-center gap-2 px-2 py-2'>
              <img
                src={userFriend.avatar}
                alt={`Avatar of ${userFriend.username}`}
                className='w-[4rem] h-[4rem] rounded-full'
              />
              <p>{userFriend.username}</p>
            </div>
          </Link>
          <div className='flex gap-1'>
            {user.friends &&
              !user.friends.some((f) => f._id === userFriend._id) &&
              userFriend._id !== user._id && (
                <button
                  className='bg-[#0444a430] text-sm text-white p-1 rounded'
                  onClick={() => {
                    handleFriendRequest(userFriend._id);
                  }}
                >
                  <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsProfile;
