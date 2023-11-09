import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { CommentForm, Loading, ReplyCard } from '../index';

const Comment = ({
  user,
  post,
  loading,
  getComments,
  showComments,
  comments,
  setReplyComments,
  replyComments,
  setShowReply,
  showReply,
  handleLike,
}) => {
  return (
    <div>
      {showComments === post._id && (
        <div className='w-full mt-4 border-t border-[#66666645] pt-4 '>
          <CommentForm
            user={user}
            id={post?._id}
            getComments={() => getComments(post?._id)}
          />

          {loading ? (
            <Loading />
          ) : comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div className='w-full py-2' key={comment?._id}>
                <div className='flex gap-3 items-center mb-1'>
                  <Link to={'/profile/' + comment?.userId?._id}>
                    <img
                      src={comment?.user.avatar}
                      // alt={comment?.userId.firstName}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  </Link>
                  <div>
                    <Link to={'/profile/' + comment?.userId?._id}>
                      <p className='font-medium text-base text-ascent-1'>
                        {comment?.user.username}
                      </p>
                    </Link>
                    <span className='text-ascent-2 text-sm'>
                      {moment(comment?.createdAt ?? '2023-05-25').fromNow()}
                    </span>
                  </div>
                </div>

                <div className='ml-12'>
                  <p className='text-ascent-2'>{comment.description}</p>

                  <div className='mt-2 flex gap-6'>
                    <p className='flex gap-2 items-center text-base text-ascent-2 cursor-pointer'>
                      {comment?.likes?.includes(user?._id) ? (
                        <BiSolidLike size={20} color='blue' />
                      ) : (
                        <BiLike size={20} />
                      )}
                      {comment?.likes?.length} Likes
                    </p>
                    <span
                      className='text-blue cursor-pointer'
                      onClick={() => setReplyComments(comment?._id)}
                    >
                      Reply
                    </span>
                  </div>

                  {replyComments === comment?._id && (
                    <CommentForm
                      user={user}
                      id={comment?._id}
                      replyAt={comment.from}
                      getComments={() => getComments(post?._id)}
                    />
                  )}
                </div>

                {/* REPLIES */}

                <div className='py-2 px-8 mt-6'>
                  {comment?.replies?.length > 0 && (
                    <p
                      className='text-base text-ascent-1 cursor-pointer'
                      onClick={() =>
                        setShowReply(
                          showReply === comment?.replies?._id
                            ? 0
                            : comment?.replies?._id,
                        )
                      }
                    >
                      Show Replies ({comment?.replies?.length})
                    </p>
                  )}

                  {showReply === comment?.replies?._id &&
                    comment?.replies?.map((reply) => (
                      <ReplyCard
                        reply={reply}
                        user={user}
                        key={reply?._id}
                        handleLike={() =>
                          handleLike(
                            '/posts/like-comment/' +
                              comment?._id +
                              '/' +
                              reply?._id,
                          )
                        }
                      />
                    ))}
                </div>
              </div>
            ))
          ) : (
            <span className='flex text-sm py-4 text-ascent-2 text-center'>
              No Comments, be first to comment
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
