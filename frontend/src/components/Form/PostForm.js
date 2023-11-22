import React from 'react';
import PostModal from '../PostModal';

const PostForm = ({
  user,
  handlePostSubmit,
  handleFileChange,
  errMsg,
  setFile,
  file,
  fileList,
  handleRemove,
}) => {
  return (
    <div>
      <div className='bg-primary px-4 rounded-lg'>
        <div className='w-full flex items-center gap-2 py-4  border-[#66666645]'>
          <div>
            <img
              src={user.avatar}
              alt='User Image'
              className='w-14 h-14 rounded-full object-cover'
            />
          </div>

          <div className='w-full'>
            <PostModal
              user={user}
              handlePostSubmit={handlePostSubmit}
              handleFileChange={handleFileChange}
              errMsg={errMsg}
              setFile={setFile}
              file={file}
              fileList={fileList}
              handleRemove={handleRemove}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
