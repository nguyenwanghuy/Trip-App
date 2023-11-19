import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import {
  Button,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  NavBar,
  Weather,
  Ads,
} from '../components';
import { suggest, requests } from '../assets/data';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import NoProfile from '../assets/NoProfile.jpg';
import { BsPersonFillAdd } from 'react-icons/bs';
import {
  apiRequest,
  deletePost,
  fetchPosts,
  handleFileUpload,
  likePost,
} from '../utils';
import PostForm from '../components/PostForm';
import { userLogin } from '../redux/userSlice';

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  // console.log(posts);
  const [friendRequest, setFriendRequest] = useState(requests);
  const [suggestedFriends, setSuggestedFriends] = useState(suggest);
  const [errMsg, setErrMsg] = useState('');
  const [file, setFile] = useState([]);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
   
  
    setLoading(false);
  };

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setErrMsg('');

    try {
      const uri = await handleFileUpload(file);
      
console.log(uri);
      const newData = { ...data, image: uri };

      const res = await apiRequest({
        url: '/post',
        token: user?.token,
        data: newData,
        method: 'POST',
      });

      if (res?.status === 'failed') {
        setErrMsg(res);
      } else {
        reset({
          description: '',
          content: '',
        });
        setFile([]);
        setErrMsg('');
        await fetchPost();
      }
      setPosting(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };

  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });
    await fetchPost();
  };

  const handleDelete = async (id) => {
    await deletePost(id, user?.token);
    await fetchPost();
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
    setLoading(true);
    fetchPost();
  }, []);

  return (
    <>
      <div className='w-full px-0 lg:px-10 pb-20 2xl:px-20 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
        <NavBar />

        <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full'>
          {/* LEFT */}
          <div className='hidden w-1/3 lg:w-1/5 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
            <Weather/>
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
              posts?.map((post) => (
              <>
                <PostCard
                  key={post?._id}
                  post={post}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                  id={post?._id}
                />
                <p>oke</p>
                </>
               
              ))
            ) : (
              <div className='flex w-full h-full items-center justify-center'>
                <p className='text-lg text-ascent-2'>No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className='hidden w-1/5 h-full lg:flex flex-col gap-8 overflow-y-auto'>
            {/* FRIEND REQUEST */}
            {/* <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
              <div className='flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]'>
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>

              <div className='w-full flex flex-col gap-4 pt-4'>
                {friendRequest?.map(({ _id, requestFrom: from }) => (
                  <div key={_id} className='flex items-center justify-between'>
                    <Link
                      to={'/profile/' + from._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1'>
                        <p className='text-base font-medium text-ascent-1'>
                          {from?.firstName} {from?.lastName}
                        </p>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <Button
                        title='Accept'
                        containerStyles='bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full'
                      />
                      <Button
                        title='Deny'
                        containerStyles='border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

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
                      to={'/profile/' + friend?._id}
                      key={friend?._id}
                      className='w-full flex gap-4 items-center cursor-pointer'
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className='w-10 h-10 object-cover rounded-full'
                      />
                      <div className='flex-1 '>
                        <p className='text-base font-medium text-ascent-1'>
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className='text-sm text-ascent-2'>
                          {friend?.profession ?? 'No Profession'}
                        </span>
                      </div>
                    </Link>

                    <div className='flex gap-1'>
                      <button
                        className='bg-[#0444a430] text-sm text-white p-1 rounded'
                        onClick={() => {}}
                      >
                        <BsPersonFillAdd size={20} className='text-[#0f52b6]' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Ads/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
