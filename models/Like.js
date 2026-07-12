import { Schema, model } from 'mongoose';

const likeSchema = new Schema({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

likeSchema.index({ article: 1, user: 1 }, { unique: true, sparse: true });
likeSchema.index({ comment: 1, user: 1 }, { unique: true, sparse: true });

export default model('Like', likeSchema);
