import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Like from '../models/Like.js';
import Bookmark from '../models/Bookmark.js';

const router = Router();

router.post('/comments/:id/like', requireAuth, async (req, res) => {
  const existing = await Like.findOne({ comment: req.params.id, user: req.session.user._id });

  if (existing) {
    await Like.deleteOne({ _id: existing._id });
  } else {
    await Like.create({ comment: req.params.id, user: req.session.user._id });
  }

  const count = await Like.countDocuments({ comment: req.params.id });
  res.json({ liked: !existing, count });
});

router.post('/articles/:id/like', requireAuth, async (req, res) => {
  const existing = await Like.findOne({ article: req.params.id, user: req.session.user._id });

  if (existing) {
    await Like.deleteOne({ _id: existing._id });
  } else {
    await Like.create({ article: req.params.id, user: req.session.user._id });
  }

  const count = await Like.countDocuments({ article: req.params.id });
  res.json({ liked: !existing, count });
});

router.post('/articles/:id/bookmark', requireAuth, async (req, res) => {
  const existing = await Bookmark.findOne({ article: req.params.id, user: req.session.user._id });

  if (existing) {
    await Bookmark.deleteOne({ _id: existing._id });
  } else {
    await Bookmark.create({ article: req.params.id, user: req.session.user._id });
  }

  res.json({ bookmarked: !existing });
});

export default router;
