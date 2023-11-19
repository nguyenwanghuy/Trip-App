import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { BiLike, BiSolidLike } from 'react-icons/bi';

const ReplyCard = ({ reply, user, handleLike }) => {
  console.log(reply);
  return (
    <div className='w-full py-3'>
      <div className='flex gap-3 items-center mb-1'>
        <Link to={'/profile/' + reply?.user._id}>
          <img
            src={reply.user.avatar}
            alt={reply?.user.username}
            className='w-10 h-10 rounded-full object-cover'
          />
        </Link>

        <div>
          <Link to={'/profile/' + reply?.user._id}>
            <p className='font-medium text-base text-ascent-1'>
              {reply?.user.username}
            </p>
          </Link>
          <span className='text-ascent-2 text-sm'>
            {moment(reply?.createdAt).fromNow()}
          </span>
        </div>
      </div>

      <div className='ml-12'>
        <p className='text-ascent-2 '>{reply?.description}</p>
        <div className='mt-2 flex gap-6'>
          <p
            className='flex gap-2 items-center text-base text-ascent-2 cursor-pointer'
            onClick={handleLike}
          >
            {reply?.likes?.includes(user?._id) ? (
              <BiSolidLike size={20} color='blue' />
            ) : (
              <BiLike size={20} />
            )}
            {reply?.likes?.length} Likes
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;
