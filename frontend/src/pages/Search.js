import React, { useEffect, useState } from 'react';
import { NavBar, PostCard } from '../components';
import { Link, useParams } from 'react-router-dom';
import { BsPersonFillAdd } from 'react-icons/bs';
import {
  apiRequest,
  deletePost,
  fetchPosts,
  likePost,
  sendFriendRequest,
} from '../utils';
import { useSelector } from 'react-redux';

const Search = () => {
  const { query } = useParams();
  const { user } = useSelector((state) => state.user);
  const [searchUsersName, setSearchUsersName] = useState([]);
  const [searchUsersPost, setSearchUsersPost] = useState([]);

  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user.token, id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest({
          url: `/user/search/s?term=${query}`,
          token: user.token,
          method: 'GET',
        });
        setSearchUsersName(res.searchUsers);
        setSearchUsersPost(res.searchContent);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [query, user.token]);

  const handleDelete = async (id) => {
    await deletePost(id, user?.token);
    await fetchPosts();
  };

  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });
    await fetchPosts();
  };

  return (
    <div className='w-full px-0 lg:px-10 pb-20 2xl:px-20 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
      <NavBar />

      <div className='h-full w-full flex flex-col gap-6 overflow-y-auto'>
        <div className='grid grid-cols-2 gap-4 bg-primary rounded-lg px-4 py-4 mt-4 shadow'>
          {!searchUsersName || searchUsersName.length === 0 ? (
            <p>No results found</p>
          ) : (
            searchUsersName.map((searchedUser) => (
              <div>
                <div
                  key={searchedUser._id}
                  className='flex items-center justify-between border px-2 py-2 border-[#66666690] rounded-lg'
                >
                  <Link to={`/trip/user/${searchedUser._id}`}>
                    <div className='flex items-center gap-2 px-2 py-2'>
                      <img
                        src={searchedUser.avatar}
                        alt={`Avatar of ${searchedUser.username}`}
                        className='w-[4rem] h-[4rem] rounded-full'
                      />
                      <p>{searchedUser.username}</p>
                    </div>
                  </Link>
                  <div className='flex gap-1'>
                    {user.friends &&
                      !user.friends.some((f) => f._id === searchedUser._id) &&
                      searchedUser._id !== user._id && (
                        <button
                          className='bg-[#0444a430] text-sm text-white p-1 rounded'
                          onClick={() => {
                            handleFriendRequest(searchedUser._id);
                          }}
                        >
                          <BsPersonFillAdd
                            size={20}
                            className='text-[#0f52b6]'
                          />
                        </button>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {!searchUsersPost || searchUsersPost.length === 0 ? (
          <p>No results found</p>
        ) : (
          searchUsersPost.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              user={user}
              deletePost={handleDelete}
              likePost={handleLikePost}
              id={post._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
