import React from 'react';

const FriendsProfile = (userInfo) => {
  // console.log(userInfo.userInfo.friends);
  return (
    <div className='grid grid-cols-2 gap-4 bg-primary rounded-lg px-4 py-4 mt-4 shadow text-ascent-1'>
      {userInfo.userInfo.friends.map((user) => (
        <div
          key={user._id}
          className='flex items-center gap-2 border px-2 py-2 border-[#66666690] rounded-lg'
        >
          <img
            src={user.avatar}
            alt={user.username}
            className='w-[4rem] h-[4rem] rounded-full'
          />
          <p>{user.username}</p>
        </div>
      ))}
    </div>
  );
};

export default FriendsProfile;
