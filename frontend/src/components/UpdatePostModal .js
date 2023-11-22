import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useForm } from 'react-hook-form';
import TextInput from './TextInput';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import { BsFiletypeGif } from 'react-icons/bs';
import FriendListDropdown from './FriendListDropdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UpdatePostModal = ({
  post,
  updatePost,
  onClose,
  initialFile,
  initialDescription,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [content, setContent] = useState(post.content);
  const [updatedFile, setUpdatedFile] = useState(initialFile);
  const [updatedDescription, setUpdatedDescription] =
    useState(initialDescription);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: initialDescription || '',
    },
  });

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const formData = await handleSubmit((data) => {
        const cleanedContent = data.content.replace(/<\/?p>/g, '');
        data.content = cleanedContent;
        updatePost(post._id, data);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setUpdatedFile(selectedFile);
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
    >
      <form className='bg-primary px-4 rounded-lg'>
        {/* Other form fields */}
        <TextInput
          styles='w-full rounded-full py-5 border-none'
          placeholder='Description...'
          name='description'
          register={register('description', {
            required: 'Write something about post',
          })}
          error={errors.description ? errors.description.message : ''}
        />
        <ReactQuill
          theme='snow'
          value={content}
          onChange={(value) => {
            setValue('content', value);
            setContent(value);
          }}
          name='content'
        />

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
        <div className='flex items-center justify-between py-4'>
          <label
            htmlFor='imgUpload'
            className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
          >
            <input
              type='file'
              className='hidden'
              id='imgUpload'
              accept='image/*'
              onChange={handleFileChange}
            />
            <BiImages />
            <span>Image</span>
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default UpdatePostModal;
