import CommentModel from '../models/commentModel.js';

const createComment = async (req, res) => {
  try {
    const { description } = req.body;
    const post = req.params.id;
    const id = req.user.id;

    if (!description || !post || !id) {
      return res.json({ message: 'thiếu ' });
    }

    const newComment = new CommentModel({
      description: description,
      post: post,
      user: id,
    });

    console.log('new', newComment);

    await newComment.save();

    res.json({
      message: 'Comment created',
      data: newComment,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
const getComment = async (req, res) => {
  const comment = await CommentModel.find({ _id: req.params.id });
  if (!comment) return res.status(400).json({ message: 'Comment not found' });
  res.json({
    data: comment,
  });
};
const updateComment = async (req, res) => {
  try {
    const { description } = req.body;
    const commentId = req.params.id;
    const updateComment = await CommentModel.findOneAndUpdate(
      { _id: commentId },
      {
        description: description,
      },
      {
        new: true,
      },
    );
    return res.json({
      message: 'Update successfully',
      data: updateComment,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteComment = async (req, res) => {
  try {
    const { id } = req.user;
    const commentId = req.params.id;
    const existingComment = await CommentModel.findByIdAndDelete({
      _id: commentId,
      user: id,
    });
    res.json({
      message: 'Delete comment successfully',
      data: existingComment,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Delete failed',
    });
  }
};
const CommentCtrl = {
  createComment,
  updateComment,
  deleteComment,
  getComment,
};
export default CommentCtrl;
