import { Schema, model } from 'mongoose';

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['city-guide', 'tips', 'culture', 'food', 'history'],
  },
  tags: [{
    type: String,
  }],
  featuredImage: {
    type: String,
    default: '',
  },
  gallery: [{
    url: String,
    alt: String,
  }],
  mapQuery: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default model('Article', articleSchema);
