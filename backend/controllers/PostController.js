import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import PostModel from '../models/postModel.js';
import UserModel from '../models/user.model.js';

cloudinary.config({
  cloud_name: 'dmlc8hjzu',
  api_key: '463525567462749',
  api_secret: 'gXldLMlEHGYIDKwoKTBaiSxPEZU',
});

//get all post
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const skip = (page - 1) * size;
    const posts = await PostModel.find().sort({ createdAt:-1 }).skip(skip).limit(size);
    const totalPosts = await PostModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / size);
    res.json({
      data: posts,
      pagination: {
        currentPage: page,
        pageSize: size,
        totalCounts: totalPosts,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// create a new post
const createPost = async (req, res) => {
  const { content, description, image } = req.body;
  const { id, username } = req.user;
  // console.log(id)
  const currentUser = await UserModel.findById(id);
  // console.log(currentUser)
  if (!currentUser) {
    res.status = 400;
    throw new Error('User not found');
  }
  const newPost = new PostModel({
    content,
    description,
    image,
    user: id,
    username: username
    
  })
  // console.log(newPost._id)

  //save the new post
  await newPost.save();
  res.status(201).json({
    data: newPost,
    message: 'Create new post successfully',
  });
};
// upload image
const uploadsImage = async (req, res) => {
  try {
    // const { content, description, image } = req.body;
    //add file
    const files = req.files;
    //upload file to cloudinary server
    const uploadPromises = files.map((f) => {
      return cloudinary.uploader
        .upload(f.path, {
          resource_type: 'auto',
          folder: 'SOCIALMEDIA',
        })
        .then((result) => {
          // Xử lý kết quả từ Cloudinary
          // console.log(result);
          fs.unlinkSync(f.path); // Xóa tệp tạm thời sau khi đã tải lên thành công
          return result;
        });
    });
    Promise.all(uploadPromises)
      .then((results) => {
        const imageUrl = results.map((result) => result.url);
        // Xử lý kết quả từ Cloudinary
        // console.log(results);
        return res
          .status(200)
          .json({ message: 'Upload successful', data: imageUrl });
      })
      .catch((error) => {
        // Xử lý lỗi từ Cloudinary
        console.log(error);
        return res.status(400).json({ error: 'Upload failed' });
      });

    // url-mongo
    // const updatePost = await PostModel.findOneAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     content,
    //     description,
    //     image: imageUrl
    //   },
    //   {
    //     new: true,
    //   }
    // )
    // return res.json({
    //   message: 'Uploading image successfully',
    //   data: imageUrl
    // })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
// get post by id
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await PostModel.findById(id);
    res.status(200).json({
      data: post,
    });
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};
// update post by id
const updatePost = async (req, res) => {
  try {
    const { content, description, image } = req.body;
    const updatePost = await PostModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        content,
        description,
        image,
      },
      {
        new: true,
      },
    );
    return res.json({
      message: 'Update successfully',
      data: updatePost,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//delete post by id
const deletePost = async (req, res) => {
  try {
    const { id } = req.user;
    const existingPost = await PostModel.findByIdAndDelete({
      _id: req.params.id,
      user: id,
    });
    res.json({
      message: 'Delete post successfully',
      data: existingPost,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error while deleting',
    });
  }
};

const likePost = async (req, res) => {
  try {
    const idPost = req.params.idPost;
    const userId = req.user.id;
    const post = await PostModel.findById(idPost);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }
    const likedByUser = post.likes.includes(userId);
    if (likedByUser) {
      post.likes.pop(userId);
    } else {
      post.likes.push(userId);
    }
    const updatePost = await post.save();

    res.status(201).json({
      data: updatePost,
      message: 'Like or unlike successfully',
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const checkViewFriend = async (req, res) => {
  const { content, description, image, viewers } = req.body;
  const { id } = req.user;

  const currentUser = await UserModel.findById(id).select('friends');
  // console.log(currentUser)
  if (!currentUser) {
    res.status(400);
    throw new Error('User not found');
  }

  const shareUser = currentUser.friends.filter((friend) =>
    viewers.includes(friend),
  );

  const newPost = new PostModel({
    content,
    description,
    image,
    user: id,
    viewers: shareUser,
  });
  await newPost.save();
  res.send({
    data: newPost,
    message: 'Success',
  });
};

const checkViewPrivate = async (req, res) => {
  try {
    const { content, description, image } = req.body;
    const { id } = req.user;

    // Kiểm tra xem người dùng hiện tại có tồn tại không
    const currentUser = await UserModel.findById(id);
    if (!currentUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    const newPost = new PostModel({
      content,
      description,
      image,
      viewers: [id],
      isPrivate: true, // Chỉ mình người dùng hiện tại có thể xem bài viết
    });

    await newPost.save();

    return res.status(201).json({
      data: newPost,
      message: 'Success',
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const getPostById = async (req, res) => {
  try {
    const userId = req.user.id;
    const postsByUser = await PostModel.find({ user: userId });
    res.status(200).json({
      posts: postsByUser,
      message: 'Success'
    });
  } catch (error) {
    res.status(404).send({
      message: error.message,
    });
  }
};
const PostCtrl = {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  uploadsImage,
  likePost,
  checkViewFriend,
  checkViewPrivate,
  getPostById,
};
export default PostCtrl;
