import mongoose from 'mongoose';


const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
});

const AlbumSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: [ImageSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    visibility: {
      type: String,
      enum: ['private', 'public', 'friends'],
      default: 'public',
    },
  },
  { timestamps: true },
);

const AlbumModel = mongoose.model('albums', AlbumSchema);
export default AlbumModel;
