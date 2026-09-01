import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../validators/authValidator.js';
import { authenticateJwt, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.get('/me', optionalAuth, authController.getMe);
router.post('/logout', optionalAuth, authController.logout);

export default router;
