import { Router } from 'express';
import * as notifController from '../controllers/notificationController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, notifController.getNotifications);
router.put('/:id/read', optionalAuth, notifController.markNotificationRead);
router.put('/read-all', optionalAuth, notifController.markAllNotificationsRead);

export default router;
