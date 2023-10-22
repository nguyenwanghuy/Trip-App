import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiRequest, handleFileUpload } from '../utils';
import TextInput from './TextInput';
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';
import Button from './Button';
import Loading from './Loading';

const PostForm = ({
  user,
  onPostSubmit,
  posting,
  setPosting,
  errMsg,
  setErrMsg,
  fetchPost,
}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {
    setPosting(true);
    setErrMsg('');

    try {
      const uris = await Promise.all(
        files.map(async (file) => await handleFileUpload(file)),
      );

      const newData = { ...data, images: uris };
      const res = await apiRequest({
        url: '/post',
        data: newData,
        token: user?.token,
        method: 'POST',
      });

      if (res?.status === 'failed') {
        setErrMsg(res);
      } else {
        reset({
          description: '',
          content: '',
        });
        setFiles([]);
        setErrMsg('');
        await fetchPost();
      }
      setPosting(false);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(handlePostSubmit)}
        className='bg-primary px-4 rounded-lg'
      >
        <div className='w-full flex items-center gap-2 py-4 border-b border-[#66666645]'>
          <img
            src={user?.profileUrl}
            alt='User Image'
            className='w-14 h-14 rounded-full object-cover'
          />
          <TextInput
            styles='w-full rounded-full py-5'
            placeholder="What's on your mind...."
            name='description'
            register={register('description', {
              required: 'Write something about post',
            })}
            error={errors.description ? errors.description.message : ''}
          />
          <TextInput
            styles='w-full rounded-full py-5'
            placeholder="What's on your mind...."
            name='content'
            register={register('content', {
              required: 'Write something about post',
            })}
            error={errors.content ? errors.content.message : ''}
          />
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

        {files.length > 0 && (
          <div className='selected-images'>
            {files.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Selected Image ${index + 1}`}
                className='w-14 h-14 rounded-full object-cover'
              />
            ))}
          </div>
        )}

        <div className='flex items-center justify-between py-4'>
          <label
            htmlFor='imgUpload'
            className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'
          >
            <input
              type='file'
              onChange={(e) => setFiles([...files, ...e.target.files])}
              className='hidden'
              id='imgUpload'
              data-max-size='5120'
              accept='.jpg, .png, .jpeg, .gif'
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

          <div>
            {posting ? (
              <Loading />
            ) : (
              <Button
                type='submit'
                title='Post'
                containerStyles='bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm'
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
