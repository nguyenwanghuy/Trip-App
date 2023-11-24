import React, { useState, useEffect } from 'react';
import NavBar from '../../NavBar';
import { useDispatch, useSelector } from 'react-redux';
import UseFunction from '../../Function/UseFunction';
import { apiRequest, fetchAlbums, handleFileUpload } from '../../../utils';
import { useForm } from 'react-hook-form';
import TextInput from '../../TextInput';
import Loading from '../../Loading';
import CustomButton from '../../CustomButton';
import FriendListDropdown from '../../FriendListDropdown';
import { Select } from 'antd';
import { Option } from 'antd/es/mentions';
import AvatarEditor from 'react-avatar-editor';

const AlbumPost = () => {
  const { user } = useSelector((state) => state.user);
  const { album } = useSelector((state) => state.album);
  const [file, setFile] = useState([]);
  const [descriptions, setDescriptions] = useState(Array(file.length).fill(''));
  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [selectedFriends, setSelectedFriends] = useState([]);
  console.log(selectedFriends);

  const { handleLikePost, fetchAlbums, handleDeletePost } = UseFunction();

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
    setDescriptions([...descriptions, ...Array(selectedFiles.length).fill('')]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...file];
    const updatedDescriptions = [...descriptions];
    updatedFiles.splice(index, 1);
    updatedDescriptions.splice(index, 1);
    setFile(updatedFiles);
    setDescriptions(updatedDescriptions);
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const handleAlbumSubmit = async (data, selectedFriends, visibility) => {
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
        images: uploadedFiles.map((url, index) => ({
          url: url[0],
          description: descriptions[index],
        })),
        visibility,
        viewers: selectedFriends,
      };
      console.log(newData);

      const res = await apiRequest({
        url: '/album',
        token: user?.token,
        data: newData,
        method: 'POST',
      });

      console.log(res);

      if (res?.status === 'failed') {
        setErrMsg(res.message);
      } else {
        reset({
          albumName: '',
        });
        setFile([]);
        setDescriptions([]);
        setErrMsg('');
        window.history.back();
      }
    } catch (error) {
      console.error('Error submitting album:', error);
      setErrMsg('An error occurred while submitting the album.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className='flex flex-col h-screen '>
      <NavBar />
      <div className='flex flex-grow '>
        <div className='w-1/5 h-full shadow-2xl'>
          <form
            onSubmit={handleSubmit((data) =>
              handleAlbumSubmit(data, selectedFriends, visibility),
            )}
            className='bg-primary flex flex-col flex-grow justify-between h-full '
          >
            <div>
              <Select
                style={{ width: '100%' }}
                placeholder='Select album visibility'
                onChange={(value) => {
                  setVisibility(value);
                }}
                value={visibility}
              >
                <Option value='public'>Public</Option>
                <Option value='private'>Private</Option>
                <Option value='friends'>Friends</Option>
              </Select>
              {visibility === 'friends' && (
                <FriendListDropdown
                  friends={user.friends}
                  onSelectFriend={(selectedFriends) => {
                    setSelectedFriends(selectedFriends);
                  }}
                  selectedFriends={selectedFriends}
                />
              )}
            </div>
            <div className='w-full items-center py-4 px-4 border-[#66666645]  h-1/2 '>
              <div className='text-2xl font-bold'>Create Album</div>
              <TextInput
                styles='w-full rounded-xl py-5 my-8'
                placeholder='Album name'
                name='albumName'
                register={register('albumName', {
                  required: 'Please enter the album name.',
                })}
                error={errors.albumName ? errors.albumName.message : ''}
              />

              <label
                htmlFor='imgUpload'
                className='flex items-center justify-center py-2 rounded-lg text-base text-ascent-1 hover:text-ascent-1 cursor-pointer w-full bg-bgColor'
              >
                <input
                  type='file'
                  onChange={handleFileChange}
                  className='hidden'
                  id='imgUpload'
                  data-max-size='5120'
                  accept='.*'
                  multiple
                />
                <span>Image</span>
              </label>

              {errMsg && (
                <span
                  role='alert'
                  className={`text-sm ${
                    errMsg?.status === 'failed'
                      ? 'text-[#f64949fe]'
                      : 'text-[#2ba150fe]'
                  } mt-0.5`}
                >
                  {errMsg}
                </span>
              )}
            </div>

            <div className='w-full items-center py-4 px-4'>
              <div>
                {posting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type='submit'
                    title='Post'
                    containerStyles='bg-[#0444a4] w-full text-white py-2 px-6 rounded-lg font-semibold text-sm flex items-center justify-center'
                  />
                )}
              </div>
            </div>
          </form>
        </div>
        <div className='w-4/5 px-5 py-5'>
          <ul className='flex my-4'>
            {file.map((selectedFile, index) => (
              <li key={index} className='relative'>
                <div style={{ margin: '2rem' }}>
                  <img
                    className='h-60 w-60'
                    src={URL.createObjectURL(selectedFile)}
                    alt={`Selected Image ${index}`}
                  />
                  <input
                    type='text'
                    placeholder={`Description for Image ${index + 1}`}
                    value={descriptions[index]}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    className='w-full mt-2 rounded-md p-2 border border-gray-300'
                  />
                </div>
                <button
                  type='button'
                  className='absolute top-0 right-0 bg-red-500 text-ascent-1 rounded-full p-1'
                  onClick={() => handleRemoveFile(index)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlbumPost;
