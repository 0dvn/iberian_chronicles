# Iberian Chronicles - Server

A travel blog about Spain. Server-side rendered with Express, EJS, and MongoDB.

Live at https://iberianchronicles.nulkode.dev

## Features

- User authentication: register, login, logout. Passwords hashed with bcrypt. Sessions stored in MongoDB.
- Three user roles: visitor (comment, like, bookmark), editor (create/edit/delete articles), admin (manage all users and content).
- User profiles with avatar upload, bio, and list of published articles.
- Article CRUD with rich text editor (Quill), featured image, photo gallery, embedded Google Maps, categories, tags, city field, and draft/publish status.
- Uploaded images are resized and converted to WebP via sharp.
- Comments on articles. Authors and admins can delete comments.
- Likes on articles and comments (AJAX, no page reload).
- Bookmarks to save articles for later.
- Search and filtering across titles, descriptions, tags. Filter by category, city, or tag.
- Share buttons for X and Facebook on every article.
- Admin panel to list users, change roles, and delete users with cascade.
- Responsive design.
- Accessibility: ARIA labels, semantic HTML, keyboard navigation.

## Tech Stack

- Node.js 20+
- Express 5
- EJS templates
- MongoDB with Mongoose 9
- express-session + bcrypt + connect-mongo for auth
- sharp for image processing
- multer for file uploads
- Font Awesome 6 (self-hosted)
- Quill 2 for rich text editing (CDN)
- GLightbox for image galleries (CDN)

## Project Structure

```
.
├── server.js                 Entry point
├── config/
│   ├── database.js           MongoDB connection (supports memory server for dev)
│   ├── seed-admin.js         Creates admin user from env vars on first start
│   └── constants.js          Category labels
├── models/
│   ├── User.js
│   ├── Article.js
│   ├── Comment.js
│   ├── Like.js
│   └── Bookmark.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── articleController.js
│   ├── commentController.js
│   └── adminController.js
├── routes/
│   ├── auth.js               /auth/*
│   ├── users.js              /users/*
│   ├── articles.js           /articles/*
│   ├── admin.js              /admin/*
│   ├── api.js                /api/* (AJAX endpoints)
│   └── pages.js              / , /about, /contact
├── middleware/
│   ├── auth.js               requireAuth, requireGuest, requireRole
│   ├── upload.js             multer config
│   └── image.js              sharp optimization
├── views/
│   ├── partials/             head, header, footer, comments
│   ├── articles/             index, show, new, edit
│   ├── auth/                 login, register
│   ├── users/                profile, edit
│   ├── admin/                users
│   └── *.ejs                 home, about, contact, 404, 403
├── public/
│   ├── styles/
│   ├── scripts/
│   ├── images/
│   └── vendor/fontawesome/
├── uploads/                  User-uploaded images (persisted via volume)
├── Dockerfile
└── docker-compose.yml
```

## Development

Prerequisites: Node.js 20+. No external MongoDB needed (uses mongodb-memory-server in dev).

```bash
git clone https://github.com/0dvn/iberian_chronicles_server.git
cd iberian_chronicles_server
npm install
cp .env.example .env
npm run dev
```

Server starts at http://localhost:3000. Admin credentials are in your .env file.

## Environment Variables

```
MONGODB_URI         MongoDB connection string. Leave empty to use memory server.
SESSION_SECRET      Secret for signing session cookies.
PORT                Server port (default 3000).
NODE_ENV            development or production.
BASE_URL            Full public URL, used for share links.
ADMIN_USERNAME      Admin username created on first start.
ADMIN_EMAIL         Admin email.
ADMIN_PASSWORD      Admin password.
```

## Deployment

With Docker:

```bash
docker compose up -d
```

This starts both the Node.js app and MongoDB. Uploads are persisted in a named volume.

For manual deployment on a VPS:

```bash
git clone https://github.com/0dvn/iberian_chronicles_server.git
cd iberian_chronicles_server
npm ci --only=production
cp .env.example .env
# Edit .env with your MongoDB URI and production settings
node server.js
```

Use a process manager like pm2 to keep it running, and a reverse proxy (nginx, caddy, traefik) for HTTPS.

## Architecture

Follows the MVC pattern:

- Models: Mongoose schemas with explicit field definitions and indexes.
- Views: EJS templates with reusable partials (header, footer, head, comments).
- Controllers: Handle request logic, call models, pass data to views.
- Routes: Map URLs to controller functions, apply middleware (auth, upload).
