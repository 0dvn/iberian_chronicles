import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import * as articleController from '../controllers/articleController.js';
import * as commentController from '../controllers/commentController.js';

const router = Router();

const articleUpload = upload.fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

router.get('/', articleController.index);
router.get('/new', requireRole('editor', 'admin'), articleController.showNew);
router.post('/', requireRole('editor', 'admin'), articleUpload, articleController.create);
router.get('/:slug', articleController.show);
router.get('/:slug/edit', requireAuth, articleController.showEdit);
router.post('/:slug', requireAuth, articleUpload, articleController.update);
router.post('/:slug/delete', requireAuth, articleController.destroy);

router.post('/:slug/comments', requireAuth, commentController.create);
router.post('/:slug/comments/:id/delete', requireAuth, commentController.destroy);

export default router;
