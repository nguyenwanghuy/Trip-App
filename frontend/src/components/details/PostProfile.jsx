import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import { posts, user } from '../../assets/data';
import PostCard from '../../components/PostCard';


const PostProfile = () => {



  const [loading, setLoading] = useState(null);
  
  const handleDelete = () => { };
  const handleLikePost = () => { };

  return (
    <div className='w-full flex  pt-5 pb-10 h-full'>
    <div className='w-full flex-1 h-full bg-orimary flex flex-col '>
      {loading ? (
        <Loading />
      ) : posts?.length > 0 ? (
        posts?.map((post) => (
          <PostCard
            post={post}
            key={post?._id}
            user={user}
            deletePost={handleDelete}
            likePost={handleLikePost}
          />
        ))
      ) : (
        <div className='flex w-full h-full items-center justify-center'>
          <p className='text-lg text-ascent-2'>No Post Available</p>
        </div>
      )}
    </div>
  </div>
  )
}

export default PostProfile