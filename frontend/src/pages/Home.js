import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  NavBar,
  PostForm,
  Weather,
  Ads,
  CustomButton,
} from '../components';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BsPersonFillAdd } from 'react-icons/bs';
import {
  apiRequest,
  getUserInfo,
  handleFileUpload,
  // sendFollowRequest,
  sendFriendRequest,
} from '../utils';
import UseFunction from '../components/Function/UseFunction';
import { userLogin } from '../redux/userSlice';

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

  const { handleLikePost, fetchPost, handleDeletePost } = UseFunction();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFile([...file, ...selectedFiles]);
  };

  const PostVisibility = {
    PRIVATE: 'private',
    PUBLIC: 'public',
    FRIENDS: 'friends',
  };

  const handlePostSubmit = async (data, selectedFriends) => {
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
        visibility: data.isPrivate
          ? PostVisibility.PRIVATE
          : data.isPublic
          ? PostVisibility.PUBLIC
          : data.isFriends
          ? PostVisibility.FRIENDS
          : PostVisibility.PUBLIC,
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
          isPrivate: false,
          isPublic: false,
          isFriends: false,
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

  // const handleFollow = async (id) => {
  //   try {
  //     await sendFollowRequest(user.token, user._id, id);
  //     await fetchSuggestedRequests();
  //   } catch (error) {
  //     console.error('Error during follow request:', error);
  //   }
  // };

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

  const getUser = async (userToken) => {
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
    // setLoading(true);
    fetchPost();
    fetchSuggestedRequests();
    // handleFollow();
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
                      likePost={handleLikePost}
                      id={post?._id}
                    />
                  ))}
              </>
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/5 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/* FRIEND REQUEST */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>

              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className='flex items-center justify-between'>
                    <Link
                      to={'/trip/user/' + from._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={from?.avatar}
                        alt={from?.username}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {from?.username}
                        </p>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <CustomButton
                        title='Accept'
                        containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                        onClick={() =>
                          handleAcceptFriendRequest(_id, 'Accepted')
                        }
                      />
                      <CustomButton
                        title='Deny'
                        containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                        onClick={() => handleAcceptFriendRequest(_id, 'Denied')}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className='w-full bg-primary shadow-sm rounded-lg px-5 py-5'>
              <div className='flex items-center justify-between text-lg text-ascent-1 border-b border-[#66666645]'>
                <span>Friend Suggestion</span>
              </div>
              <div className='w-full flex flex-col gap-4 pt-4'>
                {suggestedFriends?.map((friend) => (
                  <div
                    className='flex items-center justify-between'
                    key={friend._id}
                  >
                    <Link
                      to={'/trip/user/' + friend._id}
                      key={friend?._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={friend?.avatar}
                        alt={friend?.username}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1 '>
                        <p className='text-base font-medium text-ascent-1'>
                          {friend?.username}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {/* {friend?.profession ?? 'No Profession'} */}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <button
                        className='bg-[#0444a430] text-sm text-white p-1 rounded'
                        onClick={() => {
                          handleFriendRequest(friend._id);
                          setShow(false);
                        }}
                      >
                        <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Ads />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
