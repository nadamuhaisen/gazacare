import { Router } from 'express';
import * as hospitalController from '../controllers/hospitalController.js';
import { optionalAuth } from '../middleware/auth.js';
import { auditAccess } from '../middleware/auditLogger.js';

const router = Router();

router.get('/hospitals', optionalAuth, hospitalController.getHospitals);
router.get('/departments', optionalAuth, hospitalController.getDepartments);
router.get('/beds', optionalAuth, hospitalController.getBeds);
router.put('/beds/:id', optionalAuth, auditAccess('Beds', 'UPDATE'), hospitalController.updateBed);
router.get('/staff', optionalAuth, hospitalController.getStaff);
router.get('/hospital-manager/analytics', optionalAuth, hospitalController.getHospitalAnalytics);

export default router;
