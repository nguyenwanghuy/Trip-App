import React, { useState } from 'react';
import { Modal, Button, Select } from 'antd';
import { useForm } from 'react-hook-form';
import TextInput from './TextInput';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import { BsFiletypeGif } from 'react-icons/bs';
import FriendListDropdown from './FriendListDropdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Option } from 'antd/es/mentions';
import { useSelector } from 'react-redux';

const UpdatePostModal = ({
  post,
  updatePost,
  onClose,
  initialFile,
  initialDescription,
}) => {
  const { user } = useSelector((state) => state.user);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updatedFile, setUpdatedFile] = useState(initialFile);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [visibility, setVisibility] = useState('isPublic');
  const [dateStart, setDateStart] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [updatedDateStart, setUpdatedDateStart] = useState(
    post.dateStart || null,
  );
  const [updatedDateEnd, setUpdatedDateEnd] = useState(post.dateEnd || null);
  const [content, setContent] = useState(post.content);
  const [updatedLocation, setUpdatedLocation] = useState(post.location || '');
  const [updatedDescription, setUpdatedDescription] = useState(
    post.description,
  );
  const [updatedImage, setUpdatedImage] = useState(post.image || []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const formData = await handleSubmit((data) => {
        const cleanedContent = data.content.replace(/<\/?p>/g, '');
        data.content = cleanedContent;
        updatePost(
          post._id,
          data,
          selectedFriends,
          visibility,
          updatedDateStart,
          updatedDateEnd,
          updatedImage,
        );
      })();
      reset();
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setUpdatedImage((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setUpdatedImage((prevImages) => [...selectedFiles]);
  };

  return (
    <Modal
      title='Update Post'
      visible={true}
      onOk={handleOk}
      okButtonProps={{
        className: 'custom-ok-button',
      }}
      confirmLoading={confirmLoading}
      onCancel={onClose}
      width='50%'
      centered={true}
    >
      <form className='bg-primary px-4 rounded-lg'>
        <div className='w-full items-center gap-2 py-4'>
          <div className='flex gap-4'>
            <div>
              <img
                src={user?.avatar}
                alt={user.username}
                className='w-16 h-16 object-cover rounded-full'
              />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='font-medium text-lg text-ascent-1'>
                {user.username}
              </div>
              <div>
                <Select
                  style={{ width: '100%' }}
                  placeholder='Select post visibility'
                  onChange={(value) => setVisibility(value)}
                  value={visibility}
                >
                  <Option value='isPublic'>Public</Option>
                  <Option value='isPrivate'>Private</Option>
                  <Option value='isFriends'>Friends</Option>
                </Select>
                {visibility === 'isFriends' && (
                  <FriendListDropdown
                    friends={user.friends}
                    onSelectFriend={(selectedFriends) => {
                      setSelectedFriends(selectedFriends);
                    }}
                    selectedFriends={selectedFriends}
                  />
                )}
              </div>
            </div>
          </div>
          <div className='flex gap-4'>
            <input
              type='date'
              placeholder='Start Date'
              {...register('dateStart', {
                required: 'Start Date is required',
              })}
              onChange={(e) => {
                setValue('dateStart', e.target.value, {
                  shouldValidate: true,
                });
                setUpdatedDateStart(e.target.value);
              }}
              value={updatedDateStart || ''}
              className='w-full py-2 px-4 rounded-md mt-2 border border-ascent-2'
            />

            <input
              type='date'
              placeholder='End Date'
              {...register('dateEnd', { required: 'End Date is required' })}
              onChange={(e) => {
                setValue('dateEnd', e.target.value, {
                  shouldValidate: true,
                });
                setUpdatedDateEnd(e.target.value);
              }}
              value={updatedDateEnd || ''}
              className='w-full py-2 px-4 rounded-md mt-2 border border-ascent-2'
            />
          </div>
          <ul className='flex my-4 gap-4'>
            {updatedImage.map((image, index) => (
              <li key={index} className='relative'>
                <img
                  className='h-20 w-20'
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt={`Selected Image ${index}`}
                />
                <button
                  type='button'
                  className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                  onClick={() => handleRemoveImage(index)}
                >
                  x
                </button>
              </li>
            ))}
          </ul>
          <input
            className='w-full py-3 my-2 border-b border-[#66666645] focus:outline-none'
            type='text'
            placeholder='Nhập địa điểm'
            {...register('location', {
              required: 'Location is required',
            })}
            defaultValue={updatedLocation}
          />
          <input
            className='w-full py-3 my-2 border-b border-[#66666645] focus:outline-none'
            type='text'
            placeholder='Nhập tiêu đề...'
            {...register('description', {
              required: 'Write something about post',
            })}
            defaultValue={updatedDescription}
          />
          {errors.description && (
            <span className='text-sm text-red-500'>
              {errors.description.message}
            </span>
          )}
          <ReactQuill
            theme='snow'
            value={content}
            onChange={(value) => {
              setValue('content', value);
              setContent(value);
            }}
            name='content'
            className='h-20 mb-11'
          />
        </div>

        <ul className='flex my-4'>
          {initialFile && (
            <li>
              <img
                className='h-12 w-12'
                src={URL.createObjectURL(initialFile)}
                alt={`Selected Image`}
              />
            </li>
          )}
        </ul>

        {/* File input */}
        <div className='border border-[#66666645] px-2 py-2 rounded-lg'>
          <label
            htmlFor='imgUpload'
            className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
          >
            <input
              type='file'
              onChange={handleFileChange}
              className='hidden'
              id='imgUpload'
              data-max-size='5120'
              accept='image/*'
              multiple
            />
            <div className='flex items-center justify-between w-full'>
              <div>Add to your post: </div>

              <span className='flex gap-3'>
                <BiImages className='h-[1.5rem] w-[1.5rem]' />
                <span>Image/video</span>
              </span>
            </div>
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default UpdatePostModal;
