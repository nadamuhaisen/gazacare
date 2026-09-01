import { Router } from 'express';
import * as auditController from '../controllers/auditLogController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/audit-logs', optionalAuth, auditController.getAuditLogs);
router.get('/system-health', optionalAuth, auditController.getSystemHealth);

export default router;
