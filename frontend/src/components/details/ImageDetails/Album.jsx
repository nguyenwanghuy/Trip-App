import React,{useState,useEffect}from 'react'
import NavBar from '../../NavBar'
import { useDispatch, useSelector } from 'react-redux';
import UseFunction from '../../Function/UseFunction';
import { apiRequest, fetchAlbums, handleFileUpload } from '../../../utils';
import { useForm } from 'react-hook-form';
import TextInput from '../../TextInput';
const Album = ({handleAlbumSubmit}) => {

  const [file, setFile] = useState([]);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');

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
  };


const handleOk = async () => {
  try {
    const data = await handleSubmit((formData) => {
      const cleanedContent = formData.content.replace(/<\/?p>/g, '');
      formData.content = cleanedContent;
      handleAlbumSubmit(formData);
    })();
    reset();
    setFile([]);
    setContent('');
   
  } catch (error) {
    console.error('Error submitting post:', error);
  } finally {
    // setConfirmLoading(false);
  }
};
  
  return (
    <>
    <NavBar/>
    <div>
      <h2>Create Album</h2>
      <form onSubmit={handleSubmit(handleAlbumSubmit)}>
        <div>
          <label htmlFor="content">Album Content:</label>
            <TextInput
                styles='w-full rounded-full py-5 border-none '
                placeholder='content...'
                name='content'
                register={register('content', {
                  required: 'Write something about post',
                })}
                error={errors.content ? errors.content.message : ''}
              />
             <TextInput
                styles='w-full rounded-full py-5 border-none '
                placeholder='Description...'
                name='description'
                register={register('description', {
                  required: 'Write something about post',
                })}
                error={errors.description ? errors.description.message : ''}
              />
        </div>
        <div>
          <label htmlFor="images">Upload Images:</label>
          <input
            type="file"
            id="images"
            onChange={handleFileChange}
           
          />
        </div>
     
          <div>
           {
            file.map((file,index)=>(
             
              <img key={index} src={URL.createObjectURL(file)} />
            ))
           }
          </div>
       
        <button onClick={handleOk} type="submit">Đăng</button>
      </form>
    </div>
   </>
  )
}

export default Album