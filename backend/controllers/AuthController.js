import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model.js';
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({
        message: 'Missing required keys',
      });
    }
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials!',
      });
    }
    // console.log(user)
    //check password
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return res.status(401).json({
        message: 'Invalid credentials!',
      });
    }
    //token
    const jwtPayload = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    };
    const token = jwt.sign(jwtPayload, process.env.SECRET_KEY, {
      expiresIn: '7days',
    });

    res.json({
      token: token,
      user,
      message: 'Login successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const register = async (req, res) => {
  const { fullname, email, username, password } = req.body;
  try {
    if (!fullname || !email || !username || !password) {
      return res.status(400).json({
        message: 'Missing required keys',
      });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.json({
        message: 'User has already exist',
      });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    //create new user
    const newUser = new UserModel({
      fullname,
      email,
      username,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      message: 'Register new user successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const getMe = async (req, res) => {
  const { id } = req.user;
  const currentUser = await UserModel.findById(id).select('-password');
  if (!currentUser) {
    res.status(401);
    throw new Error('user not found');
  }

  res.send({
    userInfo: currentUser,
    message: 'success',
  });
};
const getMeProfile = async (req, res) => {
  try {
    const {
      avatar,
      fullname,
      age,
      dateOfBirth,
      gender,
      description,
      password,
    } = req.body;
    const { id } = req.user;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    // Tìm người dùng trong cơ sở dữ liệu và cập nhật thông tin cá nhân
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        avatar,
        fullname,
        age,
        dateOfBirth,
        gender,
        description,
        password: hashPassword,
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      updateMeProfile: updatedUser,
      message: 'Your profile has been updated',
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
const AuthCtrl = {
  login,
  register,
  getMe,
  getMeProfile,
};
export default AuthCtrl;
