import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput, Loading, CustomButton } from '../index';
import { apiRequest } from '../../utils';
import { RiSendPlane2Fill } from 'react-icons/ri';

const CommentForm = ({ user, id, replyAt, getComments }) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrMsg('');
    try {
      const URL = !replyAt ? '/comment/' + id : '/replyCmt/' + id;

      const newData = {
        description: data?.description,
        from: user.username,
        replyAt: replyAt,
      };
      const res = await apiRequest({
        url: URL,
        data: newData,
        token: user?.token,
        method: 'POST',
      });

      if (res?.status === 'failed') {
        setErrMsg(res);
      } else {
        reset({ description: '' });
        setErrMsg('');
        await getComments();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full border-b border-[#66666645]'
    >
      <div className='w-full flex items-center gap-2 py-4'>
        <img
          src={user.avatar}
          alt='User Image'
          className='w-10 h-10 rounded-full object-cover'
        />

        <div className='relative flex-grow'>
          <TextInput
            name='description'
            styles='w-full rounded-full py-3 mb-1 pr-12' // Adjusted styling for the input
            placeholder={replyAt ? `Reply @${replyAt}` : 'Comment this post'}
            register={register('description', {
              required: 'Comment can not be empty',
            })}
            error={errors.description ? errors.description : ''}
          />

          <div className='absolute top-[0.1rem] right-0 h-full flex items-center pr-3'>
            {loading ? (
              <Loading />
            ) : (
              <CustomButton
                title=<RiSendPlane2Fill />
                type='submit'
                containerStyles=' text-[#DADDE1] py-1 rounded-full font-semibold text-xl pr-2'
              />
            )}
          </div>
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
      </div>
    </form>
  );
};

export default CommentForm;
