import User from '../models/User.js';
import Article from '../models/Article.js';

export async function showProfile(req, res) {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).render('404', { title: 'Not Found' });

  const isOwner = req.session.user && req.session.user._id === user._id.toString();
  const isAdmin = req.session.user && req.session.user.role === 'admin';

  const filter = { author: user._id };
  if (!isOwner && !isAdmin) {
    filter.status = 'published';
  }

  const articles = await Article.find(filter).sort({ createdAt: -1 });
  res.render('users/profile', { title: user.username, user, articles });
}

export async function showEdit(req, res) {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).render('404', { title: 'Not Found' });

  if (req.session.user._id !== user._id.toString() && req.session.user.role !== 'admin') {
    return res.status(403).render('403', { title: 'Forbidden' });
  }

  res.render('users/edit', { title: 'Edit Profile', user, error: null });
}

export async function update(req, res) {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).render('404', { title: 'Not Found' });

  if (req.session.user._id !== user._id.toString() && req.session.user.role !== 'admin') {
    return res.status(403).render('403', { title: 'Forbidden' });
  }

  const { email, bio } = req.body;

  if (email && email !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.render('users/edit', { title: 'Edit Profile', user, error: 'Email is already in use.' });
    }
    user.email = email;
  }

  user.bio = bio || '';

  if (req.file) {
    user.avatar = '/uploads/' + req.file.filename;
  }

  await user.save();

  req.session.user.email = user.email;
  req.session.user.avatar = user.avatar;

  res.redirect('/users/' + user.username);
}
