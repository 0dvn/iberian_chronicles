import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';
import { seedAdmin } from './config/seed-admin.js';
import { CATEGORIES } from './config/constants.js';
import pagesRouter from './routes/pages.js';
import articlesRouter from './routes/articles.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import adminRouter from './routes/admin.js';
import apiRouter from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

const mongoUri = await connectDB();
await seedAdmin();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoUri, ttl: 60 * 60 * 24 * 7 }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.baseUrl = process.env.BASE_URL || 'http://localhost:' + PORT;
  res.locals.CATEGORIES = CATEGORIES;
  next();
});

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/', pagesRouter);

app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`);
});

export default app;
