
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import UserModel from '../models/user.model.js';

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
      new:true,
    }
  ).select("-password")
  return res.json({
    message: 'Uploading avatar successfully',
    data:updateUser
  })
 } catch (error) {
  res.status(500).send(error)
 }
}
// get user by id
const getUser = async (req, res) => {
  try {
    const {id} = req.params
    const user = await UserModel.findById(id).select('-password')
    res.status(200).json({
      data: user,
      message: 'User here'
    })
  } catch (error) {
    res.status(500).send({message: error.message})
  }
};


const addRemoveFriend = async(req, res) => {
  try {
    const {id,friendId} = req.params
    const user = await UserModel.findById(id)
    const friend = await UserModel.findById(friendId)
    if( user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id)  => id !== friendId)
      friend.friends = friend.friends.filter((id)  => id !== id)
    }else {
      user.friends.push(friendId)
      friend.friends.push(id)
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id)=>UserModel.findById(id))
    );
    const formatFriend = friends.map(
      ({_id, fullname, username, avatar}) => {
        return {_id, fullname, username, avatar}
      }
    )
    res.status(200).json({
      data: formatFriend,
      message: 'Add and remove friend'
    })
  } catch (error) {
    res.status(500).send({message: error.message})
  }
};
const UserCtrl = {
  uploadAvatar,
  getUser,
  addRemoveFriend
}

export default UserCtrl;