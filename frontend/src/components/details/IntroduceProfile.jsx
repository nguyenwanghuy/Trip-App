import React from 'react';

const IntroduceProfile = ({ userInfo }) => {
  return (
    <div className='bg-amber-300'>
      <div className='mb-2 bg-secondary p-4 rounded-xl'>
        <div className='flex gap-3 items-center mb-2'>
          <p>fullname: {userInfo.fullname}</p>
        </div>
      </div>
      <div className='mb-2 bg-primary p-4 rounded-xl'>
        <div className='flex gap-3 items-center mb-2'>
          <p>fullname</p>
        </div>
      </div>
      <div className='mb-2 bg-primary p-4 rounded-xl'>
        <div className='flex gap-3 items-center mb-2'>
          <p>fullname</p>
        </div>
      </div>
      <div className='mb-2 bg-primary p-4 rounded-xl'>
        <div className='flex gap-3 items-center mb-2'>
          <p>fullname</p>
        </div>
      </div>
      <div className='mb-2 bg-primary p-4 rounded-xl'>
        <div className='flex gap-3 items-center mb-2'>
          <p>fullname</p>
        </div>
      </div>
    </div>
  );
};

export default IntroduceProfile;
