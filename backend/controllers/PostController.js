import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import PostModel from '../models/postModel.js';
import UserModel from '../models/user.model.js';

cloudinary.config({
  cloud_name: 'dxsyy0ocl',
  api_key: '719715235574389',
  api_secret: 'ICZrIwcuhpQr24efU2DZ6CjAEIQ',
});

//get all post
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const skip = (page - 1) * size;

    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);
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
  const userId = req.user.id;
  console.log(userId);
  const currentUser = await UserModel.findById(id);
  if (!currentUser) {
    res.status = 400;
    throw new Error('User not found');
  }
  const newPost = new PostModel({
    content,
    description,
    image,
    user: id,
  });
  console.log(newPost._id);

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
    const { content, description, image } = req.body;
    //add file
    const file = req.file;

    //upload file to cloudinary server
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto',
      folder: 'Trip',
    });
    //remove temporary folder
    fs.unlinkSync(file.path);

    const imageUrl = result && result.secure_url;
    // url-mongo
    const updatePost = await PostModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        content,
        description,
        image: imageUrl,
      },
      {
        new: true,
      },
    );
    return res.json({
      message: 'Uploading image successfully',
      data: updatePost,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
// get post by id
const getPost = async (req, res) => {
  try {
    const { id } = req.user;
    const post = await PostModel.find({ user: id });
    res.json({
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

const PostCtrl = {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  uploadsImage,
};
export default PostCtrl;
