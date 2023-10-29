import mongoose from "mongoose";

const ReplyCmtSchema = new mongoose.Schema({
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
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"
    }
  
},{timestamps: true})

const ReplyCmtModel = mongoose.model('replyCmts',ReplyCmtSchema)
export default ReplyCmtModel