import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['visitor', 'editor', 'admin'],
    default: 'visitor',
  },
  bio: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '/images/default-avatar.webp',
  },
}, { timestamps: true });

export default model('User', userSchema);
