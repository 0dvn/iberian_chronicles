import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import * as userController from '../controllers/userController.js';

const router = Router();

router.get('/:username', userController.showProfile);
router.get('/:username/edit', requireAuth, userController.showEdit);
router.post('/:username', requireAuth, upload.single('avatar'), userController.update);

export default router;
