import React, { useContext, useEffect, useState } from 'react';
import { Loading, PostCard } from '../../components/index';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../../utils';

const PostProfile = ({ user, UserId }) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState({});

  const handleDelete = () => {};

  const handleLikePost = () => {};

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiRequest({
          url: `/post/${UserId}`,
          token: user.token,
          method: 'GET',
        });
        console.log(res);
        setPosts(res.posts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [UserId, user.token]);

  return (
    <div className='w-full flex  pt-5 pb-10 h-full'>
      <div className='w-full flex-1 h-full bg-orimary flex flex-col '>
        {loading ? (
          <Loading />
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post?._id}
              post={post}
              user={user}
              deletePost={handleDelete}
              likePost={handleLikePost}
              id={post?._id}
            />
          ))
        ) : (
          <div className='flex w-full h-full items-center justify-center'>
            <p className='text-lg text-ascent-2'>No Post Available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostProfile;
