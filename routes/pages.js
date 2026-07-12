import { Router } from 'express';
import Article from '../models/Article.js';

const router = Router();

router.get('/', async (req, res) => {
  const articles = await Article.find({ status: 'published' }).sort({ createdAt: -1 }).limit(6);
  const cities = await Article.distinct('city', { status: 'published', city: { $ne: '' } });
  res.render('home', { title: 'Home', articles, cities });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

export default router;
