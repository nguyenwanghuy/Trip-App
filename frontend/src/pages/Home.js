import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
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
  fetchPostsByPage,
  getUserInfo,
  handleFileUpload,
  sendFriendRequest,
} from '../utils';
import UseFunction from '../components/Function/UseFunction';
import { userLogin } from '../redux/userSlice';
import UpdatePostModal from '../components/UpdatePostModal ';
import FriendRequests from '../components/FriendRequestCard';
import SuggestedFriends from '../components/SuggestedFriends';
import { Card, Pagination } from 'antd';
import { SetPosts } from '../redux/postSlice';

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const { albums } = useSelector((state) => state.album);

  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [errMsg, setErrMsg] = useState('');
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [show, setShow] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const { handleLikePost, fetchPost, handleDeletePost } = UseFunction();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchPostsByPage(user?.token, dispatch, newPage, itemsPerPage);
  };

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  //o
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };
  const PostVisibility = {
    PRIVATE: 'private',
    PUBLIC: 'public',
    FRIENDS: 'friends',
  };
  //1
  const handlePostSubmit = async (
    data,
    selectedFriends,
    visibility,
    dateStart,
    dateEnd,
  ) => {
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
        dateStart,
        dateEnd,
      };

      const res = await apiRequest({
        url: '/post/',
        token: user?.token,
        data: newData,
        method: 'POST',
      });

      if (res?.status === 'failed') {
        setErrMsg(res.message);
      } else {
        reset({
          description: '',
          content: '',
          location: '',
        });
        setFile([]);
        setErrMsg('');
        await fetchPost();
      }

      console.log(res);
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrMsg('An error occurred while submitting the post.');
    } finally {
      setPosting(false);
    }
  };
  const updatePost = async (
    postId,
    data,
    selectedFriends,
    visibility,
    dateStart,
    dateEnd,
    updatedLocation,
    updatedImage,
  ) => {
    try {
      const updatedImage = await Promise.all(
        file.map(async (file) => {
          const uri = await handleFileUpload(file);
          return uri;
        }),
      );

      const newData = {
        ...data,
        visibility:
          visibility === 'isPrivate'
            ? PostVisibility.PRIVATE
            : visibility === 'isPublic'
            ? PostVisibility.PUBLIC
            : PostVisibility.FRIENDS,
        image: updatedImage,
        viewers: selectedFriends,
        dateStart,
        dateEnd,
        location: updatedLocation,
      };

      console.log(newData);

      const res = await apiRequest({
        url: `/post/${postId}`,
        token: user?.token,
        data: newData,
        method: 'PUT',
      });
      console.log(res);

      if (res?.status === 'failed') {
        console.error('Post update failed:', res.message);
      } else {
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

  useEffect(() => {
    fetchPost();
    fetchSuggestedRequests();
    handleFriendRequest();
    handleAcceptFriendRequest();
    handleFetchFriendRequest();
    getUser();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await apiRequest({
        url: `/post?page=${currentPage}&pageSize=${itemsPerPage}`,
        token: user?.token,
        method: 'GET',
      });
      dispatch(SetPosts(res?.data));
      setTotalPages(res?.pagination.totalPages);
    };

    fetchData();
  }, [currentPage, itemsPerPage, dispatch, setTotalPages, user?.token]);

  return (
    <div className='w-full px-0 lg:px-10 2xl:px-20 bg-bgColor lg:rounded-lg h-screen pb-10 overflow-hidden'>
      <NavBar />

      <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
        {/* LEFT */}
        <div className='hidden w-1/3 lg:w-1/5  md:flex flex-col gap-6 overflow-y-auto'>
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

              <Pagination
                current={currentPage}
                total={totalPages * itemsPerPage}
                onChange={handlePageChange}
              />
            </>
          ) : (
            <div className='flex w-full h-full items-center justify-center'>
              <p className='text-lg text-ascent-2'>No Post Available</p>
            </div>
          )}
        </div>

        {updateModalOpen && (
          <UpdatePostModal
            user={user}
            errMsg={errMsg}
            post={selectedPost}
            updatePost={updatePost}
            onClose={() => setUpdateModalOpen(false)}
            initialFile={selectedPost.image[0]}
            initialDescription={selectedPost.description}
            setFile={setFile}
            file={file}
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
  );
};

export default Home;
