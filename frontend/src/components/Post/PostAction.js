import React from 'react';
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';
import { MdOutlineDeleteOutline } from 'react-icons/md';

const PostAction = ({
  user,
  post,
  _post,
  showComments,
  setShowComments,
  getComments,
  deletePost,
  handleLike,
}) => {
  return (
    <div
      className='mt-4 flex justify-between items-center px-3 py-2 text-ascent-2
      text-base border-t border-[#66666645]'
    >
      <p
        className='flex gap-2 items-center text-base cursor-pointer'
        onClick={() => handleLike('/post/like/' + post._id)}
      >
        {post.likes.includes(user._id) ? (
          <BiSolidLike size={20} color='blue' />
        ) : (
          <BiLike size={20} />
        )}
        {post?.likes?.length} Likes
      </p>

      <p
        className='flex gap-2 items-center text-base cursor-pointer'
        onClick={() => {
          setShowComments(showComments === post._id ? null : post._id);
          getComments(post._id);
        }}
      >
        <BiComment size={20} />
        {post?.comment?.length} Comments
      </p>

      {/* {user.userInfo._id === post.user._id && (
        <div
          className='flex gap-1 items-center text-base text-ascent-1 cursor-pointer'
          onClick={() => deletePost(post._id)}
        >
          <MdOutlineDeleteOutline size={20} />
          <span>Delete</span>
        </div>
      )} */}
    </div>
  );
};

export default PostAction;