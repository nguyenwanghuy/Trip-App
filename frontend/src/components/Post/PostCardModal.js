import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { PostCard } from '..';

const PostCardModal = ({ post, isOpen, onClose }) => {
  return (
    <Modal
      title={post.title}
      centered
      visible={isOpen}
      onOk={onClose}
      onCancel={onClose}
      width={1000}
    >
      <img src={post.postImage} alt='Post Image' style={{ width: '100%' }} />
      <p>{post.postContent}</p>
    </Modal>
  );
};

const CardModal = () => {
  const [open, setOpen] = useState(false);

  const post = {
    title: 'Sample Post',
    postImage: 'url_to_post_image.jpg',
    postContent: 'This is the post content...',
  };

  return (
    <>
      <Button type='primary' onClick={() => setOpen(true)}>
        <PostCard />
      </Button>
      <PostCardModal post={post} isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default CardModal;
