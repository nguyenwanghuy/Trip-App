import React from 'react';
import PostImage from './PostImage';

const PostContent = ({ post, showAll, setShowAll }) => {
  return (
    <div>
      <div className='text-ascent-2'>
        <div>
          Từ {post.dateStart} đến {post.dateEnd} Tại {post.location}
        </div>
        <PostImage post={post} />

        <div className='font-bold text-left'>
          {showAll === post?._id
            ? post?.description
            : post?.description?.slice(0, 300)}

          {post?.description?.length > 301 &&
            (showAll === post?._id ? (
              <span
                className='text-blue ml-2 font-medium cursor-pointer'
                onClick={() => setShowAll(0)}
              >
                Show Less
              </span>
            ) : (
              <span
                className='text-blue ml-2 font-medium cursor-pointer'
                onClick={() => setShowAll(post?._id)}
              >
                Show More
              </span>
            ))}
        </div>

        <div className='text-left'>
          {showAll === post?._id ? post?.content : post?.content?.slice(0, 300)}

          {post?.content?.length > 301 &&
            (showAll === post?._id ? (
              <span
                className='text-blue ml-2 font-mediu cursor-pointer'
                onClick={() => setShowAll(0)}
              >
                Show Less
              </span>
            ) : (
              <span
                className='text-blue ml-2 font-medium cursor-pointer'
                onClick={() => setShowAll(post?._id)}
              >
                Show More
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostContent;
