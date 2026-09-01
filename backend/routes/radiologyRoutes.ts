import { Router } from 'express';
import * as radController from '../controllers/radiologyController.js';
import { optionalAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const router = Router();

router.get('/', optionalAuth, radController.getRadiology);
router.post('/request', optionalAuth, auditAccess('Radiology', 'REQUEST_SCAN'), radController.requestRadiology);

export default router;
