import React, { useState, useEffect } from 'react';
import { apiRequest, likePost } from '../../utils';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Comment from '../Comment/Comment';
import PostAction from './PostAction';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PostImage from './PostImage';

const PostDetail = () => {
  const { user } = useSelector((state) => state.user);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [isEditingComment, setIsEditingComment] = useState(false);

  const { id } = useParams();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const getPostComments = async (id, token) => {
    try {
      const res = await apiRequest({
        url: '/comment/' + id,
        token: token,
        method: 'GET',
      });
      return res.data;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch comments');
    }
  };

  const getComments = async () => {
    setReplyComments(0);
    setLoading(true);
    try {
      const result = await getPostComments(post._id, user.token);
      setComments(result);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async () => {
    try {
      const res = await apiRequest({
        url: `/post/users/${id}`,
        token: user.token,
        method: 'GET',
      });

      setPost(res.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch post details');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (uri) => {
    await likePost(uri);
    await getComments(post?._id);
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post) {
      getComments();
    }
  }, [post]);
  return (
    <div className='flex h-screen w-full'>
      {post && (
        <>
          <div className='w-2/3 h-full flex items-center justify-center bg-[black]'>
            {/* <img src={post.image || null} /> */}
          </div>
          <div className='w-1/3 mx-5 my-5 h-screen'>
            <div>
              <div> {post.user.username}</div>
              <div>{post.description}</div>
              <p>{post.content}</p>
            </div>
            <div>
              <PostAction
                user={user}
                post={post}
                showComments={showComments}
                setShowComments={setShowComments}
                getComments={getComments}
                handleLike={handleLike}
              />
              <Comment
                user={user}
                post={post}
                loading={loading}
                getComments={getComments}
                showComments={showComments}
                comments={comments}
                setReplyComments={setReplyComments}
                replyComments={replyComments}
                setShowReply={setShowReply}
                showReply={showReply}
                editComment={editComment}
                setEditComment={setEditComment}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetail;
