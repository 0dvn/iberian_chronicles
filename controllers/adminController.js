import User from '../models/User.js';
import Article from '../models/Article.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import Bookmark from '../models/Bookmark.js';

export async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.render('admin/users', { title: 'Manage Users', users });
}

export async function updateRole(req, res) {
  const { role } = req.body;
  const validRoles = ['visitor', 'editor', 'admin'];

  if (!validRoles.includes(role)) return res.redirect('/admin/users');

  const user = await User.findById(req.params.id);
  if (!user) return res.redirect('/admin/users');

  if (user._id.toString() === req.session.user._id) return res.redirect('/admin/users');

  user.role = role;
  await user.save();
  res.redirect('/admin/users');
}

export async function deleteUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.redirect('/admin/users');

  if (user._id.toString() === req.session.user._id) return res.redirect('/admin/users');

  await Comment.deleteMany({ user: user._id });
  await Like.deleteMany({ user: user._id });
  await Bookmark.deleteMany({ user: user._id });
  await Article.deleteMany({ author: user._id });
  await User.deleteOne({ _id: user._id });

  res.redirect('/admin/users');
}
