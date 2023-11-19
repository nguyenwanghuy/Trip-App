import FriendRequest from '../models/friendRequest.js';
import UserModel from '../models/user.model.js';

export const getUser = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    const { UserId } = req.params;

    const user = await UserModel.findById(UserId ?? id).populate({
      path: 'friends',
      select: '-password',
    });

    if (!user) {
      return res.status(200).send({
        message: 'User Not Found',
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'auth error',
      success: false,
      error: error.message,
    });
  }
};

export const friendRequest = async (req, res, next) => {
  try {
    const id = req.user.id;

    const { requestTo } = req.body;

    const requestExist = await FriendRequest.findOne({
      requestFrom: id,
      requestTo,
    });

    if (requestExist) {
      next('Friend Request already sent.');
      return;
    }

    const accountExist = await FriendRequest.findOne({
      requestFrom: requestTo,
      requestTo: id,
    });

    if (accountExist) {
      next('Friend Request already sent.');
      return;
    }

    const newRes = await FriendRequest.create({
      requestTo,
      requestFrom: id,
    });

    res.status(201).json({
      success: true,
      message: 'Friend Request sent successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'auth error',
      success: false,
      error: error.message,
    });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const id = req.user.id;

    const request = await FriendRequest.find({
      requestTo: id,
      requestStatus: 'Pending',
    })
      .populate({
        path: 'requestFrom',
        select: 'username avatar -password',
      })
      .limit(10)
      .sort({
        _id: -1,
      });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'auth error',
      success: false,
      error: error.message,
    });
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const id = req.user.id;
    const { rid, status } = req.body;

    const requestExist = await FriendRequest.findById(rid);

    if (!requestExist) {
      next('No Friend Request Found.');
      return;
    }

    const newRes = await FriendRequest.findByIdAndUpdate(
      { _id: rid },
      { requestStatus: status },
    );

    if (status === 'Accepted') {
      const user = await UserModel.findById(id);

      user.friends.push(newRes?.requestFrom);

      await user.save();

      const friend = await UserModel.findById(newRes?.requestFrom);

      friend.friends.push(newRes?.requestTo);

      await friend.save();
    }

    res.status(201).json({
      success: true,
      message: 'Friend Request ' + status,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'auth error',
      success: false,
      error: error.message,
    });
  }
};
