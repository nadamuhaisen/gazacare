import { Router } from 'express';
import * as mrController from '../controllers/medicalRecordController.js';
import { optionalAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const router = Router();

router.get('/medical-records/:id', optionalAuth, auditAccess('MedicalRecords', 'READ_EHR'), mrController.getMedicalRecord);
router.get('/clinical-notes', optionalAuth, mrController.getClinicalNotes);

export default router;
