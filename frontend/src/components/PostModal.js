import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import TextInput from './TextInput';
import { BsFiletypeGif, BsPersonFillAdd } from 'react-icons/bs';
import { BiImages, BiSolidVideo } from 'react-icons/bi';

const PostModal = ({
  handlePostSubmit,
  handleFileChange,
  errMsg,
  setFile,
  file,
}) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    if (file.length === 0) {
      setOpen(false);
    } else {
      setConfirmLoading(true);

      handleSubmit((data) => {
        handlePostSubmit(data)
          .then(() => {
            reset();
            setFile([]);
            setConfirmLoading(false);
            setOpen(false);
          })
          .catch((error) => {
            console.error('Lỗi khi đăng bài:', error);
            setConfirmLoading(false);
          });
      })();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={showModal}>Open Modal with async logic</Button>
      <Modal
        title='Title'
        open={open}
        onOk={handleOk}
        okButtonProps={{ className: 'custom-ok-button' }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <>
          <form
            onSubmit={handleSubmit(handlePostSubmit)}
            className='bg-primary px-4 rounded-lg'
          >
            <div className='w-full items-center gap-2 py-4 border-b border-[#66666645]'>
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
            </div>
          </form>
        </>
      </Modal>
    </div>
  );
};

export default PostModal;
