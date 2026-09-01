import { Router } from 'express';
import * as contactController from '../controllers/contactController.js';
import { validateContactMessage } from '../validators/contactValidator.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const router = Router();

// Public submission and emergency hotlines
router.post('/submit', optionalAuth, validateContactMessage, contactController.submitContactMessage);
router.post('/', optionalAuth, validateContactMessage, contactController.submitContactMessage);
router.get('/hotlines', contactController.getEmergencyHotlines);

// Management routes for support / hospital managers / admin
router.get('/messages', optionalAuth, auditAccess('ContactMessages', 'READ_ALL'), contactController.getContactMessages);
router.get('/messages/:id', optionalAuth, auditAccess('ContactMessages', 'READ_ONE'), contactController.getContactMessageById);
router.put('/messages/:id/status', optionalAuth, auditAccess('ContactMessages', 'UPDATE_STATUS'), contactController.updateContactStatus);

export default router;
