import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils';
import { Comment, PostAction, PostContent, PostHeader } from '../index';
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
  const handleLike = async (uri) => {
    await likePost(uri);
    await getComments(post?._id);
  };
  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className='mb-2 bg-primary p-4 rounded-xl'>
      <PostHeader post={post} />

      {/* <div>
        <div className='text-ascent-2'> {post?.userId?.location}</div>
      </div> */}

      <PostContent post={post} showAll={showAll} setShowAll={setShowAll} />

      <PostAction
        user={user}
        post={post}
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
