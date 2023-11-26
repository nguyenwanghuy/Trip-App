import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { FloatButton, Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import FriendsCard from '../components/FriendsCard';
import PostCard from '../components/index';
import { NavBar } from '../components';
import {
  apiRequest,
  deletePost,
  fetchPosts,
  handleAvatarUpload,
  handleFileUpload,
  likePost,
} from '../utils';
import PostProfile from '../components/details/PostProfile';
import IntroduceProfile from '../components/details/IntroduceProfile';
import FriendsProfile from '../components/details/FriendsProfile';
import ImagesProfile from '../components/details/ImagesProfile';
import { Button, Modal } from 'antd'; // Import Button and Modal
import { HiOutlineCamera } from 'react-icons/hi2';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activeComponent, setActiveComponent] = useState('posts');

  const fetchUserData = async () => {
    try {
      const res = await apiRequest({
        url: `/user/${id}`,
        token: user.token,
        method: 'GET',
      });
      // console.log(res);
      setUserInfo(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleLikePost = async (uri) => {
    await likePost({ uri: uri, token: user?.token });
    await fetchPosts();
  };

  const handleDelete = async (id) => {
    await deletePost(id, user?.token);
    await fetchPosts();
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      if (file) {
        setUploading(true);

        const uri = await handleFileUpload(file);

        await apiRequest({
          url: `/user/upload-avatar`,
          token: user.token,
          method: 'PUT',
          data: { avatar: uri },
        });

        await fetchUserData();

        setFile(null);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setUploading(false);
      setModalVisible(false);
    }
  };
  const handleCancel = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchUserData();
  }, [id]);

  const renderContent = () => {
    switch (activeComponent) {
      case 'introduce':
        return (
          <IntroduceProfile userInfo={userInfo} fetchUserData={fetchUserData} />
        );
      case 'friends':
        return <FriendsProfile userInfo={userInfo} />;
      case 'images':
        return <ImagesProfile userInfo={userInfo} />;
      default:
        return <PostProfile user={user} UserId={id} userInfo={userInfo} />;
    }
  };

  return (
    <div>
      <div className='home w-full px-0 lg:px-10 pb-20 2xl:px-20 bg-bgColor h-screen overflow-y-auto'>
        <NavBar />

        <div className='w-full rounded-lg h-[35rem] mt-5 flex flex-col justify-between items-center lg:gap-4 pb-10 bg-primary relative '>
          <div className='w-full h-3/4 '>
            <img
              src='https://img.freepik.com/free-photo/old-black-background-grunge-texture-dark-wallpaper-blackboard-chalkboard-room-wall_1258-28312.jpg'
              className='w-full h-full rounded-t-lg object-cover'
            />
          </div>
          <div className='w-48 h-48 absolute bottom-20 left-1/2 transform -translate-x-1/2 rounded-full'>
            <img
              src={userInfo?.avatar}
              className='w-full h-full rounded-full border-[5px] border-ascent-3 object-cover '
            />

            {user?._id === userInfo?._id && (
              <Button
                type='secondary'
                onClick={showModal}
                className='h-[2rem] text-2xl absolute bottom-5 right-2 rounded-full bg-bgColor px-1 text-ascent-1'
              >
                <HiOutlineCamera />
              </Button>
            )}
          </div>

          <div className='font-bold text-2xl text-ascent-1'>
            {userInfo && userInfo.username}
          </div>

          <div className='absolute bottom-[-1.5rem] flex'>
            <Button
              onClick={() => setActiveComponent('posts')}
              className='bg-primary rounded-tr-3xl rounded-tl-none rounded-bl-3xl rounded-br-none text-ascent-1 text-sm text-center flex items-center justify-center px-10 py-4 m-2 shadow-inner'
            >
              Post
            </Button>
            <Button
              onClick={() => setActiveComponent('introduce')}
              className='bg-primary rounded-tr-3xl rounded-tl-none rounded-bl-3xl rounded-br-none text-ascent-1 text-sm text-center flex items-center justify-center px-10 py-4 m-2 shadow-inner'
            >
              Giới thiệu
            </Button>
            <Button
              onClick={() => setActiveComponent('friends')}
              className='bg-primary rounded-tr-3xl rounded-tl-none rounded-bl-3xl rounded-br-none text-ascent-1 text-sm text-center flex items-center justify-center px-10 py-4 m-2 shadow-inner '
            >
              Bạn bè
            </Button>
            <Button
              onClick={() => setActiveComponent('images')}
              className='bg-primary rounded-tr-3xl rounded-tl-none rounded-bl-3xl rounded-br-none text-ascent-1 text-sm text-center flex items-center justify-center px-10 py-4 m-2 shadow-inner'
            >
              Ảnh
            </Button>
          </div>
        </div>

        <div className='content mt-10'>{renderContent()}</div>
      </div>

      <Modal
        title='Upload Avatar'
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <input type='file' accept='image/*' onChange={handleFileChange} />
      </Modal>
    </div>
  );
};

export default Profile;
