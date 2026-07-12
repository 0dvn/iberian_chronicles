import slugify from 'slugify';
import Article from '../models/Article.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import Bookmark from '../models/Bookmark.js';
import { optimizeImage } from '../middleware/image.js';

async function uniqueSlug(title) {
  let slug = slugify(title, { lower: true, strict: true });
  let existing = await Article.findOne({ slug });
  let count = 1;
  while (existing) {
    slug = slugify(title, { lower: true, strict: true }) + '-' + (++count);
    existing = await Article.findOne({ slug });
  }
  return slug;
}

export async function index(req, res) {
  const { q, category, city, tag } = req.query;
  const filter = { status: 'published' };

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (city) {
    filter.city = { $regex: city, $options: 'i' };
  }

  if (tag) {
    filter.tags = tag;
  }

  const articles = await Article.find(filter).sort({ createdAt: -1 });
  const categories = await Article.distinct('category', { status: 'published' });
  res.render('articles/index', { title: 'Articles', articles, categories, q: q || '', category: category || '', city: city || '', tag: tag || '' });
}

export async function show(req, res) {
  const article = await Article.findOne({ slug: req.params.slug }).populate('author');
  if (!article) return res.status(404).render('404', { title: 'Not Found' });

  const isOwner = req.session.user && req.session.user._id === article.author._id.toString();
  const isAdmin = req.session.user && req.session.user.role === 'admin';

  if (article.status === 'draft' && !isOwner && !isAdmin) {
    return res.status(404).render('404', { title: 'Not Found' });
  }

  const comments = await Comment.find({ article: article._id })
    .populate('user')
    .sort({ createdAt: -1 });

  const commentIds = comments.map(c => c._id);

  const likeCounts = await Like.aggregate([
    { $match: { comment: { $in: commentIds } } },
    { $group: { _id: '$comment', count: { $sum: 1 } } },
  ]);

  const commentLikes = {};
  likeCounts.forEach(l => { commentLikes[l._id.toString()] = l.count; });

  const userLikedComments = new Set();
  if (req.session.user) {
    const userLikes = await Like.find({ comment: { $in: commentIds }, user: req.session.user._id });
    userLikes.forEach(l => userLikedComments.add(l.comment.toString()));
  }

  const articleLikeCount = await Like.countDocuments({ article: article._id });
  let userLikedArticle = false;
  let userBookmarked = false;

  if (req.session.user) {
    userLikedArticle = !!(await Like.findOne({ article: article._id, user: req.session.user._id }));
    userBookmarked = !!(await Bookmark.findOne({ article: article._id, user: req.session.user._id }));
  }

  res.render('articles/show', {
    title: article.title,
    article,
    comments,
    commentLikes,
    userLikedComments,
    articleLikeCount,
    userLikedArticle,
    userBookmarked,
  });
}

export function showNew(req, res) {
  res.render('articles/new', { title: 'New Article', error: null });
}

export async function create(req, res) {
  const { title, description, category, tags, content, mapQuery, city, status } = req.body;

  if (!title || !content) {
    return res.render('articles/new', { title: 'New Article', error: 'Title and content are required.' });
  }

  const slug = await uniqueSlug(title);

  const article = new Article({
    title,
    slug,
    description: description || '',
    content,
    category: category || 'city-guide',
    tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    mapQuery: mapQuery || '',
    city: city || '',
    status: status || 'published',
    author: req.session.user._id,
  });

  if (req.files && req.files.featuredImage && req.files.featuredImage[0]) {
    article.featuredImage = await optimizeImage(req.files.featuredImage[0], 1600);
  }

  if (req.files && req.files.gallery) {
    for (const file of req.files.gallery) {
      const url = await optimizeImage(file, 800);
      article.gallery.push({ url, alt: title + ' photo' });
    }
  }

  await article.save();
  res.redirect('/articles/' + article.slug);
}

export async function showEdit(req, res) {
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article) return res.status(404).render('404', { title: 'Not Found' });

  const isOwner = req.session.user._id === article.author.toString();
  const isAdmin = req.session.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).render('403', { title: 'Forbidden' });
  }

  res.render('articles/edit', { title: 'Edit: ' + article.title, article, error: null });
}

export async function update(req, res) {
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article) return res.status(404).render('404', { title: 'Not Found' });

  const isOwner = req.session.user._id === article.author.toString();
  const isAdmin = req.session.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).render('403', { title: 'Forbidden' });
  }

  const { title, description, category, tags, content, mapQuery, city, status, removeGallery } = req.body;

  article.title = title || article.title;
  article.description = description || '';
  article.category = category || article.category;
  article.tags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  article.content = content || article.content;
  article.mapQuery = mapQuery || '';
  article.city = city || '';
  article.status = status || article.status;

  if (req.files && req.files.featuredImage && req.files.featuredImage[0]) {
    article.featuredImage = await optimizeImage(req.files.featuredImage[0], 1600);
  }

  if (removeGallery) {
    const toRemove = Array.isArray(removeGallery) ? removeGallery.map(Number) : [Number(removeGallery)];
    article.gallery = article.gallery.filter((_, i) => !toRemove.includes(i));
  }

  if (req.files && req.files.gallery) {
    for (const file of req.files.gallery) {
      const url = await optimizeImage(file, 800);
      article.gallery.push({ url, alt: article.title + ' photo' });
    }
  }

  await article.save();
  res.redirect('/articles/' + article.slug);
}

export async function destroy(req, res) {
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article) return res.status(404).render('404', { title: 'Not Found' });

  const isOwner = req.session.user._id === article.author.toString();
  const isAdmin = req.session.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).render('403', { title: 'Forbidden' });
  }

  await Article.deleteOne({ _id: article._id });
  res.redirect('/articles');
}
