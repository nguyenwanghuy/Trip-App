import React, { useState, useEffect } from 'react';
import { apiRequest, likePost } from '../../utils';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'antd'; // Import Carousel from Ant Design
import { useSelector } from 'react-redux';
import Comment from '../Comment/Comment';
import PostAction from './PostAction';
import UseFunction from '../Function/UseFunction';
import moment from 'moment';
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
  const { handleLikePost, handleDeletePost } = UseFunction();
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
    await handleLikePost(uri);
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

  //
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className='flex flex-col md:flex-row h-screen w-ful'>
      {post && (
        <>
          <div className='w-2/3 h-screen flex items-center justify-center bg-[black]'>
            <Link
              to='/'
              className='flex gap-2 items-center absolute top-5 left-5'
            >
              <div className='p-1  md:p-2 bg-[#065ad8] rounded text-white font-extrabold text-xl'>
                TS
              </div>
              <span className='text-xxl font-bold text-slate-400 text-white'>
                TripSocial
              </span>
              <button
                className='text-white bg-transparent border-none outline-none cursor-pointer'
                onClick={handleGoBack}
                style={{ marginLeft: '800px' }}
              >
                <span style={{ fontSize: '24px' }}>×</span>
              </button>
            </Link>
            <Carousel
              dotPosition='bottom'
              autoplay
              className='w-[55rem] h-full '
            >
              {post.image.map((image, index) => (
                <div key={index}>
                  <img src={image} className='w-full h-full ' />
                </div>
              ))}
            </Carousel>
          </div>
          <div className='w-1/3 mx-5 my-5 h-5/6 overflow-y-scroll'>
            <div>
              <div>
                <div className='flex items-center '>
                  <Link to={'/trip/user/' + post.user?._id}>
                    <img
                      className='w-12 h-12 rounded-full object-cover'
                      src={post.user.avatar}
                    />
                  </Link>
                  <div>
                    <Link to={'/trip/user/' + post.user?._id}>
                      <span>
                        <p className='text-base font-bold'>
                          {post.user.username}
                        </p>
                      </span>
                    </Link>
                    <div>
                      <span className='text-ascent-2'>
                        {moment(post?.createdAt ?? Date.now()).fromNow()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
