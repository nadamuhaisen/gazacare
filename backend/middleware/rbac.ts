import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/apiResponse.js';

export const requireRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ResponseHelper.unauthorized(res, 'يجب تسجيل الدخول للوصول إلى هذا المورد');
    }

    const userRole = req.user.role?.toUpperCase();
    const isAllowed = allowedRoles.some((r) => r.toUpperCase() === userRole || userRole === 'ADMIN');

    if (!isAllowed) {
      return ResponseHelper.forbidden(
        res,
        `غير مصرح لهذا الدور (${req.user.role}) بالوصول. الأدوار المسموحة: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

export const requireDoctorOrManager = requireRoles(['DOCTOR', 'HOSPITAL_MANAGER', 'ADMIN']);
export const requireDoctorOrLab = requireRoles(['DOCTOR', 'LAB_ANALYST', 'ADMIN']);
export const requireMedicalStaff = requireRoles(['DOCTOR', 'HOSPITAL_MANAGER', 'LAB_ANALYST', 'PHARMACIST', 'ADMIN']);
