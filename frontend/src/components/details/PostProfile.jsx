import React, { useContext, useEffect, useState } from 'react';
import { Loading, PostCard, ProfileCard } from '../../components/index';
import { useParams } from 'react-router-dom';
import { apiRequest } from '../../utils';
import InfoProfileCard from '../InfoProfileCard';

const PostProfile = ({ user, UserId, userInfo }) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState({});

  // console.log(userInfo);

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
        setPosts(res.posts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [UserId, user.token]);

  return (
    <div className='w-full flex pt-5 pb-10 h-full gap-6 '>
      <div className='hidden md:w-1/3 md:block'>
        <InfoProfileCard user={userInfo} />
      </div>
      <div className='w-2/3 flex-1 h-full bg-orimary flex flex-col '>
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
