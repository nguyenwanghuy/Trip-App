import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    description:{
        type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
      },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    },
  
},{timestamps: true})

const CommentModel = mongoose.model('comments',CommentSchema)
export default CommentModel