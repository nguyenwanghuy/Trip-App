import React, { useState } from 'react';
import { Button, Modal, Select } from 'antd';
import { useForm } from 'react-hook-form';
import TextInput from './TextInput';
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import FriendListDropdown from './FriendListDropdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Option } from 'antd/es/mentions';
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';

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
  const [visibility, setVisibility] = useState('isPublic');

  const handleRemoveFile = (index) => {
    const updatedFiles = [...file];
    updatedFiles.splice(index, 1);
    setFile(updatedFiles);
  };

  // const { Option } = Select;

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

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
    if (file.length === 0 || !visibility) {
      setOpen(false);
      return;
    }
    setConfirmLoading(true);
    try {
      const data = await handleSubmit((formData) => {
        const cleanedContent = formData.content.replace(/<\/?p>/g, '');
        formData.content = cleanedContent;
        handlePostSubmit(formData, selectedFriends, visibility);
      })();
      reset();
      setFile([]);
      setContent('');
      setVisibility(null);
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

  const handleVisibilityChange = (value) => {
    setVisibility(value);
    if (value === 'isFriends') {
      setOpen(true);
    }
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
                name='content'
              />
              <div className='w-full border-t border-[#66666645]'></div>

              <ul className='flex my-4'>
                {file.map((selectedFile, index) => (
                  <li key={index} className='relative'>
                    <img
                      className='h-12 w-12 '
                      src={URL.createObjectURL(selectedFile)}
                      alt={`Selected Image ${index}`}
                    />
                    <button
                      type='button'
                      className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                      onClick={() => handleRemoveFile(index)}
                    >
                      X
                    </button>
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
                  accept='*'
                  multiple
                />

                <BiImages />
                <span>Image</span>
              </label>

              {/* <ImgCrop rotationSlider>
                <Upload
                  action='http://api.cloudinary.com/v1_1/dmlc8hjzu/image/upload/'
                  listType='picture-card'
                  fileList={file}
                  onChange={handleFileChange}
                  onPreview={(file) => onPreview(file)}
                >
                  {file.length < 5 && '+ Upload'}
                </Upload>
              </ImgCrop> */}

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
