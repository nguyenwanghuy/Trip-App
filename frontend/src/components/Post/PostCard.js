import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../utils';
import { Comment, PostAction, PostContent, PostHeader } from '../index';
import UpdatePostModal from '../UpdatePostModal ';
import { Link } from 'react-router-dom';

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

const PostCard = ({
  post,
  user,
  deletePost,
  likePost,
  updatePost,
  file,
  id,
}) => {
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [editComment, setEditComment] = useState(null);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
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

  const incrementPostViewCount = async (postId) => {
    try {
      const res = await apiRequest({
        url: `/trip/post/view/${postId}`,
        token: user.token,
        method: 'POST',
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (uri) => {
    await likePost(uri);
    await getComments(post?._id);
  };

  const handleUpdatePost = () => {
    setUpdateModalOpen(true);
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className='mb-2 bg-primary p-4 rounded-xl'>
      <PostHeader
        post={post}
        deletePost={deletePost}
        user={user}
        handleUpdate={handleUpdatePost}
      />

      {showAll ? (
        <PostContent post={post} showAll={showAll} setShowAll={setShowAll} />
      ) : (
        <Link
          to={`/trip/post/${post._id}`}
          onClick={() => incrementPostViewCount(post._id)}
        >
          <PostContent post={post} showAll={showAll} setShowAll={setShowAll} />
        </Link>
      )}

      <PostAction
        user={user}
        post={post}
        showComments={showComments}
        setShowComments={setShowComments}
        getComments={getComments}
        handleLike={handleLike}
      />
      {showComments === post._id && (
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
          editComment={editComment}
          setEditComment={setEditComment}
        />
      )}

      {updateModalOpen && (
        <UpdatePostModal
          post={post}
          updatePost={updatePost}
          onClose={() => setUpdateModalOpen(false)}
          file={file}
          initialFile={file[0]}
          initialDescription={post.description}
        />
      )}
    </div>
  );
};

export default PostCard;
