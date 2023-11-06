import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../components/Loading';
import { posts, user } from '../../assets/data';
import PostCard from '../../components/PostCard';


const PostProfile = () => {



  const [loading, setLoading] = useState(null);
  
  const handleDelete = () => { };
  const handleLikePost = () => { };

  return (
    <div className='w-full flex  pt-5 pb-10 h-full'>
    <div className='w-full flex-1 h-full bg-orimary flex flex-col '>
     <p>Bài viết</p>
    </div>
  </div>
  )
}

export default PostProfile