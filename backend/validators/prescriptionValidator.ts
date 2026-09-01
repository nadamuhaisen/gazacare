import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/apiResponse.js';

export const validatePrescriptionCreate = (req: Request, res: Response, next: NextFunction) => {
  const { medicines, patientName } = req.body || {};
  const errors: string[] = [];

  if (!patientName) {
    errors.push('اسم المريض مطلوب لإصدار الوصفة الطبية.');
  }

  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    errors.push('يجب إضافة دواء واحد على الأقل في الوصفة الطبية.');
  }

  if (errors.length > 0) {
    return ResponseHelper.unprocessable(res, errors, 'فشل إصدار الوصفة الطبية');
  }

  next();
};
