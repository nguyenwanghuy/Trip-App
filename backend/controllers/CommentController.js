import CommentModel from "../models/commentModel.js";



const createComment = async (req,res) => {
   try {
    const {description} = req.body;
    const postId = req.params.id;
    const {id}= req.user.id;

   const newComment = new CommentModel({
    description,
    postId,
    id
   })
  
   await newComment.save();
  
    res.json({
        message: 'Comment created',
        data: newComment
    })
   } catch (error) {
    res.status(500).send(error)

   }
    
}
const getComment = async (req, res) => {
    const comment = await CommentModel.find().sort({ createdAt: -1 }) 
    if(!comment) return res.status(400).json({message: 'Comment not found'})
    res.json({
        data: comment
    })
};
const updateComment = async (req, res) => {
   try {
    const {description} = req.body;
    const commentId =req.params.id
    const updateComment = await CommentModel.findOneAndUpdate(
     {_id: commentId},
     {
         description: description
     },
     {
         new: true,
     }
    )
    return res.json({
     message: 'Update successfully',
     data: updateComment
   })
   } catch (error) {
    res.status(500).send(error)
   }
};
const deleteComment = async (req, res) => {
   try {
    const {id} = req.user;
    const commentId =req.params.id
    const existingComment = await CommentModel.findByIdAndDelete(
        {_id: commentId, user:id}
    )
    res.json({
        message: 'Delete comment successfully',
        data : existingComment
    })
   } catch (error) {
    res.status(400).json({
        message: "Delete failed",
      })
   }
};
const CommentCtrl = {
    createComment,
    updateComment,
    deleteComment,
    getComment
}
export default CommentCtrl