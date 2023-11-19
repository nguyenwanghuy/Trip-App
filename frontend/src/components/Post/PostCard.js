import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils';
import { Comment, PostAction, PostContent, PostHeader } from '../index';
import { io } from 'socket.io-client';
import CardModal from './PostCardModal';

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
  }
};

const PostCard = ({ post, user, deletePost, likePost, id }) => {
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [_post, setPost] = useState(post);

  const getComments = async () => {
    setReplyComments(0);
    setLoading(true);
    try {
      const result = await getPostComments(post._id, user.token);
      setComments(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // const socket = io('http://localhost:8001');
  // useEffect(() => {
  //   socket.on('like', (data) => {
  //     setPost((prev) => {
  //       if (prev && prev._id === data.postId) {
  //         const likes = prev.likes ?? [];

  //         if (likes.includes(data.from)) {
  //           return {
  //             ...prev,
  //             likes: likes.filter((id) => id !== data.from),
  //           };
  //         } else {
  //           return {
  //             ...prev,
  //             likes: [...likes, data.from],
  //           };
  //         }
  //       }
  //       return prev;
  //     });
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // const userId = user?.userInfo?._id;

  // const handleLike = async (uri) => {
  //   await likePost(uri);
  //   await getComments(post?._id);
  //   if (userId) {
  //     const ownerId = _post.user;
  //     if (ownerId) {
  //       socket.emit('like', { postId: post._id, from: userId, to: ownerId });
  //     }
  //   }
  // };

  const handleLike = async (uri) => {
    await likePost(uri);
    await getComments(post?._id);
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className='mb-2 bg-primary p-4 rounded-xl'>
      <PostHeader post={post} deletePost={deletePost} user={user} />

      <PostContent post={post} showAll={showAll} setShowAll={setShowAll} />

      <PostAction
        user={user}
        post={post}
        _post={_post}
        showComments={showComments}
        setShowComments={setShowComments}
        getComments={getComments}
        deletePost={deletePost}
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
        handleLike={handleLike}
      />
    </div>
  );
};

export default PostCard;
