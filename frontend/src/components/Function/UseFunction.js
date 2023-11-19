import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest, deletePost, fetchPosts, likePost } from '../../utils';

const UseFunction = (id) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLikePost = async (uri) => {
    try {
      setLoading(true);
      await likePost({ uri: uri, token: user?.token });
      await fetchPosts(user?.token, dispatch);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setLoading(true);
      await deletePost(postId, user?.token);
      await fetchPosts(user?.token, dispatch);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async () => {
    setLoading(true);
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };

  const fetchUserData = async () => {
    try {
      const res = await apiRequest({
        url: `/user/${id}`,
        token: user.token,
        method: 'GET',
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  return {
    handleLikePost,
    handleDeletePost,
    fetchUserData,
    fetchPost,
    loading,
  };
};

export default UseFunction;
