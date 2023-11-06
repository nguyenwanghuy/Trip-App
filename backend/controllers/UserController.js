
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import UserModel from '../models/user.model.js';
import PostModel from '../models/postModel.js';

cloudinary.config({
  cloud_name: 'dxsyy0ocl',
  api_key: '719715235574389',
  api_secret: 'ICZrIwcuhpQr24efU2DZ6CjAEIQ',
});
const uploadAvatar = async (req, res) => {
  try {
    const { id } = req.user

    //add file
    const file = req.file
    //upload file to cloudinary server
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto',
      folder: 'Trip',
    })
    //remove temporary folder
    fs.unlinkSync(file.path)

    const avatarUrl = result && result.secure_url;
    // url-mongo 
    const updateUser = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        avatar: avatarUrl
      },
      {
        new: true,
      }
    ).select("-password")
    return res.json({
      message: 'Uploading avatar successfully',
      data: updateUser
    })
  } catch (error) {
    res.status(500).send(error)
  }
}
// get user by id
const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await UserModel.findById(id).select('-password')
    res.status(200).json({
      data: user,
      message: 'User here'
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
};

const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params
    const user = await UserModel.findById(id)
    const friend = await UserModel.findById(friendId)
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId)
      friend.friends = friend.friends.filter((id) => id !== id)
    } else {
      user.friends.push(friendId)
      friend.friends.push(id)
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => UserModel.findById(id))
    );
    const formatFriend = friends.map(
      ({ _id, fullname, username, avatar }) => {
        return { _id, fullname, username, avatar }
      }
    )
    res.status(200).json({
      data: formatFriend,
      message: 'Add and remove friend'
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
};

const searchUsers = async (req, res) => {
  try {
    const searchUsers = await UserModel.find({ username: { $regex: req.query.u } }).select('username avatar')
    if (!searchUsers)
      return res.status(404).json({ message: 'User not found' })
    const searchContent = await PostModel.find({ content: { $regex: req.query.c } });
    if (!searchContent)
    return res.status(404).json({ message: 'Post not found' })
    res.status(200).json({
      searchUsers: searchUsers,
      searchContent: searchContent
    });
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
};

const suggestUser = async (req, res) => {
  try {
    const { id } = req.user
    const user = await UserModel.findById(id)
    const users = await UserModel.find().select('username avatar -password');

    const nonFriend = users.filter((u) => u.id !== user.id && !user.friends.includes(u.id))
    const randomUsers = getRandomElements(nonFriend, 2);
    res.status(200).send({
      data: randomUsers,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Hàm lấy ngẫu nhiên các phần tử từ một mảng
function getRandomElements(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
const UserCtrl = {
  uploadAvatar,
  getUser,
  addRemoveFriend,
  searchUsers,
  suggestUser,
}

export default UserCtrl;