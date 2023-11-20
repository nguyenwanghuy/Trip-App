import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { BsThreeDots } from 'react-icons/bs';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { Button, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const PostHeader = ({ post, user, deletePost }) => {
  const isCurrentUserPost = user._id === post.user._id;

  const menuItems = [
    {
      label: <a href={`https://www.example.com/${post._id}`}>View Details</a>,
      key: 'viewDetails',
    },
    {
      type: 'divider',
    },
    isCurrentUserPost && {
      label: 'Delete',
      key: 'delete',
      onClick: () => deletePost(post._id),
    },
  ].filter(Boolean);

  return (
    <div className='flex gap-3 items-center mb-2'>
      <Link to={'/trip/user/' + post.user?._id}>
        <img
          src={post.user?.avatar}
          alt={post?.userId?.firstName}
          className='w-14 h-15 object-cover rounded-full'
        />
      </Link>

      <div className='w-full flex justify-between'>
        <div className=''>
          <Link to={'/trip/user/' + post.user?._id}>
            <p className='font-medium text-lg text-ascent-1'>
              {post.user?.username}
            </p>
          </Link>
          <span className='text-ascent-2'>
            {moment(post?.createdAt ?? Date.now()).fromNow()}
          </span>
        </div>

        <Dropdown
          menu={{
            items: menuItems,
          }}
          trigger={['click']}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <BsThreeDots />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default PostHeader;
