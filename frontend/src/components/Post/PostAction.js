// PostAction.js
import { io } from 'socket.io-client';
import React, {useState,useEffect} from 'react';
import { BiComment, BiLike, BiSolidLike } from 'react-icons/bi';

const PostAction = ({
  user,
  post,
  // _post,
  showComments,
  setShowComments,
  getComments,
  handleLike,
  
}) => 
{
  const [_post, setPost] = useState(post);
  const socket = io('http://localhost:8001');
  
  useEffect(() => {
    socket.on('like', (data) => {
      setPost((prev) => {
        if (prev && prev._id === data.postId) {
          const likes = prev.likes ?? [];

          if (likes.includes(data.from)) {
            return {
              ...prev,
              likes: likes.filter((id) => id !== data.from),
            };
          } else {
            return {
              ...prev,
              likes: [...likes, data.from],
            };
          }
        }
        return prev;
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const userId = user?._id;
  const handleLikeClick = (uri) => {
    handleLike(uri);
    if (userId) {
      const ownerId = _post.user;
      if (ownerId) {
        socket.emit('like', { postId: post._id, from: userId, to: ownerId });
      }
    }
  };

  return (
    <div className='mt-4 flex justify-between items-center px-3 py-2 text-ascent-2 text-base border-t border-[#66666645]'>
      <p
        className='flex gap-2 items-center text-base cursor-pointer'
        onClick={() => handleLikeClick('/post/like/' + _post._id)}
      >
        {_post.likes.includes(user._id) ? (
          <BiSolidLike size={20} color='blue' />
        ) : (
          <BiLike size={20} />
        )}
        {_post?.likes?.length} Likes
      </p>

      <p
        className='flex gap-2 items-center text-base cursor-pointer'
        onClick={() => {
          setShowComments(showComments === post._id ? null : post._id);
          getComments(post._id);
        }}
      >
        <BiComment size={20} />
        {post?.comment?.length} Comments
      </p>
    </div>
  );
};

export default PostAction;
