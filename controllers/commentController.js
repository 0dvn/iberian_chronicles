import Comment from '../models/Comment.js';
import Article from '../models/Article.js';
import Like from '../models/Like.js';

export async function create(req, res) {
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article) return res.status(404).render('404', { title: 'Not Found' });

  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    return res.redirect('/articles/' + article.slug);
  }

  await Comment.create({
    content: content.trim().substring(0, 1000),
    article: article._id,
    user: req.session.user._id,
  });

  res.redirect('/articles/' + article.slug);
}

export async function destroy(req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.redirect('/articles/' + req.params.slug);

  const isOwner = req.session.user._id === comment.user.toString();
  const isAdmin = req.session.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).render('403', { title: 'Forbidden' });
  }

  await Like.deleteMany({ comment: comment._id });
  await Comment.deleteOne({ _id: comment._id });

  res.redirect('/articles/' + req.params.slug);
}
