import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { BsThreeDots } from 'react-icons/bs';
import { Button } from 'antd';

const PostHeader = ({ post }) => {
  return (
    <div className='flex gap-3 items-center mb-2'>
      <Link to={'/trip/user/' + post.user._id}>
        <img
          src={post.user.avatar}
          alt={post?.userId?.firstName}
          className='w-14 h-15 object-cover rounded-full'
        />
      </Link>

      <div className='w-full flex justify-between'>
        <div className=''>
          <Link to={'/trip/user/' + post.user._id}>
            <p className='font-medium text-lg text-ascent-1'>
              {post.user.username}
            </p>
          </Link>
          <span className='text-ascent-2'>
            {moment(post?.createdAt ?? Date.now()).fromNow()}
          </span>
        </div>

        <Button className='hover:bg-[#66666645] p-4 rounded-full'>
          <BsThreeDots />
        </Button>
      </div>
    </div>
  );
};

export default PostHeader;
