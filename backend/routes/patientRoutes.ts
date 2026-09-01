import { Router } from 'express';
import * as patientController from '../controllers/patientController.js';
import { validateVitals, validatePatientCreate } from '../validators/patientValidator.js';
import { optionalAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const router = Router();

router.get('/', optionalAuth, auditAccess('Patients', 'READ_ALL'), patientController.getPatients);
router.post('/', optionalAuth, validatePatientCreate, auditAccess('Patients', 'CREATE'), patientController.createPatient);
router.get('/profile', optionalAuth, patientController.getPatientProfile);
router.put('/profile', optionalAuth, auditAccess('Patients', 'UPDATE_PROFILE'), patientController.updatePatientProfile);
router.get('/vitals', optionalAuth, patientController.getVitals);
router.post('/vitals', optionalAuth, validateVitals, auditAccess('Patients', 'ADD_VITALS'), patientController.addVitals);
router.get('/medications', optionalAuth, patientController.getMedications);
router.get('/timeline', optionalAuth, patientController.getTimeline);
router.get('/:id', optionalAuth, auditAccess('Patients', 'READ_ONE'), patientController.getPatientById);
router.put('/:id', optionalAuth, auditAccess('Patients', 'UPDATE'), patientController.updatePatientProfile);

export default router;
