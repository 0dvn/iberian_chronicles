import { Schema, model } from 'mongoose';

const bookmarkSchema = new Schema({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

bookmarkSchema.index({ article: 1, user: 1 }, { unique: true });

export default model('Bookmark', bookmarkSchema);
