import React from 'react';
import { Link } from 'react-router-dom';
import { BsPersonFillAdd } from 'react-icons/bs';
import { CustomButton } from '.';

const SuggestedFriends = ({
  suggestedFriends,
  handleFriendRequest,
  setShow,
}) => {
  return (
    <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5 '>
      <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
        <span>Friend Suggestion</span>
      </div>
      <div className='w-full gap-4 pt-4 flex flex-col'>
        {suggestedFriends?.map((friend) => (
          <div className='flex items-center justify-between' key={friend._id}>
            <Link
              to={`/trip/user/${friend._id}`}
              className='w-full flex gap-4 items-center cursor-pointer'
            >
              <img
                src={friend?.avatar}
                alt={friend?.username}
                className='w-10 h-10 object-cover rounded-full'
              />
              <div className='flex-1'>
                <p className='text-base font-medium text-ascent-1'>
                  {friend?.username}
                </p>
                <span className='text-sm text-ascent-2'></span>
              </div>
            </Link>

            <div className='flex gap-1'>
              <button
                className='bg-[#0444a430] text-sm text-white p-1 rounded'
                onClick={() => {
                  handleFriendRequest(friend._id);
                  setShow(false);
                }}
              >
                <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedFriends;
