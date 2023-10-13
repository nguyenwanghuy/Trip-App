
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
// get by id
const getUser = async (req, res) => {
  try {
    const {id} = req.params
    const user = await UserModel.findById(id)
    res.status(200).json({
      data: user,
      message: 'User here'
    })
  } catch (error) {
    res.status(500).send({message: error.message})
  }
};

// get user friends
const getUserFriends = async (req, res) => {
  try {
    const {id} = req.params
    const user = await UserModel.findById(id);
    
  } catch (error) {
    res.status(500).send({message: error.message})
  }
};
const UserCtrl = {
  uploadAvatar,
  getUser,
  getUserFriends
}

export default UserCtrl;