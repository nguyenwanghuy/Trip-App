import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import TextInput from './TextInput';
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import { InboxOutlined } from '@ant-design/icons';
import FriendListDropdown from './FriendListDropdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PostModal = ({
  handlePostSubmit,
  handleFileChange,
  errMsg,
  setFile,
  file,
  user,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showFriendList, setShowFriendList] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [content, setContent] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    if (file.length === 0) {
      setOpen(false);
      return;
    }

    setConfirmLoading(true);

    try {
      const data = await handleSubmit((data) =>
        handlePostSubmit(data, selectedFriends),
      )();
      reset();
      setFile([]);
      setContent('');
      setOpen(false);
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        onClick={showModal}
        className='border-none bg-[#F2F3F5] w-full h-[3rem] text-left'
      >
        Share your experience!
      </Button>
      <Modal
        title='Share your experience'
        open={open}
        onOk={handleOk}
        okButtonProps={{
          className: 'custom-ok-button',
          disabled: file.length === 0,
        }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width='50%'
        centered={true}
      >
        <>
          <form
            onSubmit={handleSubmit(handlePostSubmit)}
            className='bg-primary px-4 rounded-lg '
          >
            <div className='w-full items-center gap-2 py-4 border-b border-[#66666645]'>
              <label className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                <input
                  type='checkbox'
                  {...register('isPublic')}
                  defaultChecked={false}
                />
                <span>Public</span>
              </label>
              <label className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                <input
                  type='checkbox'
                  {...register('isPrivate')}
                  defaultChecked={false}
                />
                <span>Private</span>
              </label>
              <label className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                <input
                  type='checkbox'
                  {...register('isFriends')}
                  defaultChecked={false}
                  onChange={(e) => setShowFriendList(e.target.checked)}
                />
                <span>Friends</span>
              </label>
              {showFriendList && (
                <FriendListDropdown
                  friends={user.friends}
                  onSelectFriend={(selectedFriends) => {
                    setSelectedFriends(selectedFriends);
                  }}
                  selectedFriends={selectedFriends}
                />
              )}

              <TextInput
                styles='w-full rounded-full py-5 border-none '
                placeholder='Description...'
                name='description'
                register={register('description', {
                  required: 'Write something about post',
                })}
                error={errors.description ? errors.description.message : ''}
              />
              <div className='w-full border-t border-[#66666645]'></div>
              <ReactQuill
                theme='snow'
                value={content}
                onChange={(value) => {
                  setValue('content', value);
                  setContent(value);
                }}
                name='content' // Add the name attribute for registration
              />
              <div className='w-full border-t border-[#66666645]'></div>

              <ul className='flex my-4'>
                {file.map((selectedFile, index) => (
                  <li key={index}>
                    <img
                      className='h-12 w-12 '
                      src={URL.createObjectURL(selectedFile)}
                      alt={`Selected Image ${index}`}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {errMsg?.message && (
              <span
                role='alert'
                className={`text-sm ${
                  errMsg?.status === 'failed'
                    ? 'text-[#f64949fe]'
                    : 'text-[#2ba150fe]'
                } mt-0.5`}
              >
                {errMsg?.message}
              </span>
            )}

            <div className='flex items-center justify-between py-4'>
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
                  // accept='.jpg, .png, .jpeg, .gif'
                  accept='*'
                  multiple
                />

                <BiImages />
                <span>Image</span>
              </label>

              <label
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                htmlFor='videoUpload'
              >
                <input
                  type='file'
                  data-max-size='5120'
                  onChange={(e) => setFile(e.target.files[0])}
                  className='hidden'
                  id='videoUpload'
                  accept='.mp4, .wav'
                />
                <BiSolidVideo />
                <span>Video</span>
              </label>

              <label
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
                htmlFor='vgifUpload'
              >
                <input
                  type='file'
                  data-max-size='5120'
                  onChange={(e) => setFile(e.target.files[0])}
                  className='hidden'
                  id='vgifUpload'
                  accept='.gif'
                />
                <BsFiletypeGif />
                <span>Gif</span>
              </label>
            </div>
          </form>
        </>
      </Modal>
    </div>
  );
};

export default PostModal;
