import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { validateAppointmentCreate } from '../validators/appointmentValidator.js';
import { optionalAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const router = Router();

router.get('/', optionalAuth, appointmentController.getAppointments);
router.post('/', optionalAuth, validateAppointmentCreate, auditAccess('Appointments', 'CREATE'), appointmentController.createAppointment);
router.get('/:id', optionalAuth, appointmentController.getAppointmentById);
router.put('/:id/status', optionalAuth, auditAccess('Appointments', 'UPDATE_STATUS'), appointmentController.updateAppointmentStatus);
router.post('/:id/cancel', optionalAuth, auditAccess('Appointments', 'CANCEL'), appointmentController.cancelAppointment);

export default router;
