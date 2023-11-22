import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import {
  FriendsCard,
  Loading,
  ProfileCard,
  NavBar,
  PostForm,
  Weather,
  Ads,
  CustomButton,
  PostCard,
} from '../components';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BsPersonFillAdd } from 'react-icons/bs';
import {
  apiRequest,
  getUserInfo,
  handleFileUpload,
  sendFriendRequest,
} from '../utils';
import UseFunction from '../components/Function/UseFunction';
import { userLogin } from '../redux/userSlice';
import UpdatePostModal from '../components/UpdatePostModal ';
import FriendRequests from '../components/FriendRequestCard';
import SuggestedFriends from '../components/SuggestedFriends';

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [show, setShow] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const { handleLikePost, fetchPost, handleDeletePost } = UseFunction();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
//o
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    console.log([...file, ...selectedFiles]);
    setFile([...file, ...selectedFiles]);
  };

  const PostVisibility = {
    PRIVATE: 'private',
    PUBLIC: 'public',
    FRIENDS: 'friends',
  };
//1
  const handlePostSubmit = async (data, selectedFriends, visibility) => {
    setPosting(true);
    setErrMsg('');

    try {
      const uploadedFiles = await Promise.all(
        file.map(async (file) => {
          const uri = await handleFileUpload(file);
          return uri;
        }),
      );

      const newData = {
        ...data,
        image: uploadedFiles,
        visibility:
          visibility === 'isPrivate'
            ? PostVisibility.PRIVATE
            : visibility === 'isPublic'
            ? PostVisibility.PUBLIC
            : PostVisibility.FRIENDS,
        viewers: selectedFriends,
      };

      console.log(newData);

      const res = await apiRequest({
        url: '/post/viewPrivate',
        token: user?.token,
        data: newData,
        method: 'POST',
      });

      console.log(res);

      if (res?.status === 'failed') {
        setErrMsg(res.message);
      } else {
        reset({
          description: '',
          content: '',
        });
        setFile([]);
        setErrMsg('');
        await fetchPost();
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrMsg('An error occurred while submitting the post.');
    } finally {
      setPosting(false);
    }
  };

  const updatePost = async (postId, newData) => {
    try {
      const res = await apiRequest({
        url: `/post/${postId}`,
        token: user?.token,
        data: newData,
        method: 'PUT',
      });

      if (res?.status === 'failed') {
        console.error('Post update failed:', res.message);
      } else {
        console.log('Post updated successfully:', res.data);
        await fetchPost();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const fetchSuggestedRequests = async () => {
    try {
      const res = await apiRequest({
        url: '/user/suggest/u',
        token: user?.token,
        method: 'GET',
      });
      setSuggestedFriends(res.data);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user.token, id);
      await fetchSuggestedRequests();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchFriendRequest = async () => {
    try {
      const res = await apiRequest({
        url: '/test/get-friend-request',
        token: user.token,
        method: 'POST',
      });

      setFriendRequest(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async (token) => {
    try {
      const res = await getUserInfo(user.token);
      const newData = { token: user.token, ...res };
      dispatch(userLogin(newData));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptFriendRequest = async (id, status) => {
    try {
      const res = await apiRequest({
        url: '/test/accept-request',
        token: user.token,
        method: 'POST',
        data: { rid: id, status },
      });
      setFriendRequest(res.data);
      getUser();
    } catch (error) {
      console.error(error);
    }
  };

  // refresh token
  const refreshToken = async () =>{
    try {
      const res = axios.post(
        "http://localhost:8001/trip/auth/refresh",{
          withCredentials: true
        });
        return res.data;
    } catch (error) {
      console.log(error);
    }
  }
  let axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async(config) => {
      let date = new Date();
      const decodedToken = jwtDecode(user?.token)
      if(decodedToken.exp < date.getTime()/1000) {
        const data = await refreshToken();
        const refreshUser = {
          ...user,
          token: data.token,
        };
        dispatch(userLogin(refreshUser))
        config.headers["token"] = data.token;
      }
      return config;
    },
    (err) =>{
      return Promise.reject(err);
    }
    )

  useEffect(() => {
    fetchPost();
    fetchSuggestedRequests();
    handleFriendRequest();
    handleAcceptFriendRequest();
    handleFetchFriendRequest();
    getUser();
  }, []);

  return (
    <>
      <div className='w-full px-0 lg:px-10 2xl:px-20 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <NavBar />

        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/5 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard friends={user.friends} />
            <Weather />
          </div>

          {/* CENTER */}
          <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg'>
            <PostForm
              user={user}
              handlePostSubmit={handlePostSubmit}
              handleFileChange={handleFileChange}
              posting={posting}
              errMsg={errMsg}
              setFile={setFile}
              file={file}
            />

            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              <>
                {posts
                  .filter((post) => post.viewers.includes(user._id))
                  .map((post) => (
                    <PostCard
                      key={post?._id}
                      post={post}
                      user={user}
                      deletePost={handleDeletePost}
                      updatePost={updatePost}
                      likePost={handleLikePost}
                      id={post?._id}
                      file={file}
                    />
                  ))}
              </>
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {updateModalOpen && (
            <UpdatePostModal
              post={selectedPost}
              updatePost={updatePost}
              onClose={() => setUpdateModalOpen(false)}
              initialFile={selectedPost.image[0]}
              initialDescription={selectedPost.description}
            />
          )}

          {/* RIGHT */}
          <div className='hidden w-1/5 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            <FriendRequests
              friendRequest={friendRequest}
              handleAcceptFriendRequest={handleAcceptFriendRequest}
            />

            <SuggestedFriends
              suggestedFriends={suggestedFriends}
              handleFriendRequest={handleFriendRequest}
              setShow={setShow}
            />
            <Ads />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
