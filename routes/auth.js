import { Router } from 'express';
import { requireGuest } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);
router.get('/register', requireGuest, authController.showRegister);
router.post('/register', requireGuest, authController.register);
router.get('/logout', authController.logout);

export default router;
