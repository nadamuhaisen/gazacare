import { Router } from 'express';
import * as prescriptionController from '../controllers/prescriptionController.js';
import { validatePrescriptionCreate } from '../validators/prescriptionValidator.js';
import { optionalAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const router = Router();

router.get('/', optionalAuth, prescriptionController.getPrescriptions);
router.post('/', optionalAuth, validatePrescriptionCreate, auditAccess('Prescriptions', 'CREATE'), prescriptionController.createPrescription);
router.get('/:id', optionalAuth, auditAccess('Prescriptions', 'READ_ONE'), prescriptionController.getPrescriptionById);

export default router;
