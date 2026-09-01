import { Router } from 'express';
import * as labController from '../controllers/laboratoryController.js';
import { validateLabRequest } from '../validators/labValidator.js';
import { optionalAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const router = Router();

router.get('/requests', optionalAuth, labController.getLabRequests);
router.post('/requests', optionalAuth, validateLabRequest, auditAccess('Laboratory', 'CREATE_REQUEST'), labController.createLabRequest);
router.get('/requests/:id', optionalAuth, labController.getLabRequestById);
router.post('/results', optionalAuth, auditAccess('Laboratory', 'SAVE_RESULT'), labController.saveLabResult);
router.post('/requests/:id/critical', optionalAuth, auditAccess('Laboratory', 'MARK_CRITICAL'), labController.markLabCritical);

export default router;
