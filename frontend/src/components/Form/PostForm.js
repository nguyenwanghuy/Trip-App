import React from 'react';
import PostModal from '../PostModal';

const PostForm = ({
  user,
  handlePostSubmit,
  handleFileChange,
  errMsg,
  setFile,
  file,
}) => {
  return (
    <div>
      <div className='bg-primary px-4 rounded-lg'>
        <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
          <img
            src={user.userInfo.avatar}
            alt='User Image'
            className='w-14 h-14 rounded-full object-cover'
          />

          <PostModal
            user={user}
            handlePostSubmit={handlePostSubmit}
            handleFileChange={handleFileChange}
            errMsg={errMsg}
            setFile={setFile}
            file={file}
          />
        </div>
      </div>
    </div>
  );
};

export default PostForm;
