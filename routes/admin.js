import { Router } from 'express';
import { requireRole } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = Router();

router.use(requireRole('admin'));

router.get('/', (req, res) => res.redirect('/admin/users'));
router.get('/users', adminController.listUsers);
router.post('/users/:id/role', adminController.updateRole);
router.post('/users/:id/delete', adminController.deleteUser);

export default router;
