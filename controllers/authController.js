import bcrypt from 'bcrypt';
import User from '../models/User.js';

export function showLogin(req, res) {
  res.render('auth/login', { title: 'Login', error: null });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.render('auth/login', { title: 'Login', error: 'Invalid email or password.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.render('auth/login', { title: 'Login', error: 'Invalid email or password.' });
  }

  req.session.user = {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };

  res.redirect('/');
}

export function showRegister(req, res) {
  res.render('auth/register', { title: 'Register', error: null });
}

export async function register(req, res) {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || username.length < 3) {
    return res.render('auth/register', { title: 'Register', error: 'Username must be at least 3 characters.' });
  }

  if (!password || password.length < 6) {
    return res.render('auth/register', { title: 'Register', error: 'Password must be at least 6 characters.' });
  }

  if (password !== confirmPassword) {
    return res.render('auth/register', { title: 'Register', error: 'Passwords do not match.' });
  }

  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    return res.render('auth/register', { title: 'Register', error: 'Email is already registered.' });
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return res.render('auth/register', { title: 'Register', error: 'Username is already taken.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, passwordHash, role: 'visitor' });

  req.session.user = {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };

  res.redirect('/');
}

export function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}
