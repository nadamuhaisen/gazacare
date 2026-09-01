import { Router } from 'express';
import * as doctorController from '../controllers/doctorController.js';
import { optionalAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const router = Router();

router.get('/', optionalAuth, doctorController.getDoctors);
router.get('/stats', optionalAuth, doctorController.getDoctorStats);
router.get('/dashboard', optionalAuth, doctorController.getDoctorDashboard);
router.get('/patients', optionalAuth, auditAccess('DoctorPatients', 'READ_ALL'), doctorController.getMyPatients);
router.post('/consultations', optionalAuth, auditAccess('Consultation', 'RECORD'), doctorController.recordConsultation);
router.post('/diagnoses', optionalAuth, auditAccess('Diagnosis', 'CREATE'), doctorController.addDiagnosis);
router.post('/notes', optionalAuth, auditAccess('ClinicalNotes', 'CREATE'), doctorController.addClinicalNote);
router.get('/:id', optionalAuth, doctorController.getDoctorById);

export default router;
