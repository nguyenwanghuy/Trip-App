import React from 'react';
import { Modal } from 'antd';
import { useForm } from 'react-hook-form';
import Loading from '../Loading';
import CustomButton from '../CustomButton';
import TextInput from '../TextInput';

const EditProfileForm = ({
  isVisible,
  onCancel,
  onSubmit,
  isSubmitting,
  errMsg,
  defaultValues,
  user,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: { ...user },
  });

  return (
    <Modal
      title='Edit Profile'
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          name='fullname'
          label='Fullname'
          placeholder='Fullname'
          type='text'
          styles='w-full'
          register={register('fullname')}
        />
        <TextInput
          name='age'
          label='Age'
          placeholder='Age'
          type='number'
          styles='w-full'
          register={register('age')}
        />
        <TextInput
          name='dateOfBirth'
          label='Date of Birth'
          placeholder='Date of Birth'
          type='date'
          styles='w-full'
          register={register('dateOfBirth')}
        />
        <TextInput
          name='gender'
          label='Gender'
          placeholder='Gender'
          type='text'
          styles='w-full'
          register={register('gender')}
        />
        <TextInput
          name='description'
          label='Description'
          placeholder='Description'
          type='text'
          styles='w-full'
          register={register('description')}
        />

        {/* 
          <label
            className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
            htmlFor='imgUpload'
          >
            <input
              type='file'
              className=''
              id='imgUpload'
              onChange={(e) => handleSelect(e)}
              accept='.jpg, .png, .jpeg'
            />
          </label> */}

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

        <div className='py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]'>
          {isSubmitting ? (
            <Loading />
          ) : (
            <CustomButton
              type='submit'
              containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
              title='Submit'
            />
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileForm;
