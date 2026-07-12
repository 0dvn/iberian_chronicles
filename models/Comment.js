import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
    index: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default model('Comment', commentSchema);
