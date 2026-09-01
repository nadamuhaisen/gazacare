import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/apiResponse.js';

export const validateLabRequest = (req: Request, res: Response, next: NextFunction) => {
  const { testName, patientName } = req.body || {};
  const errors: string[] = [];

  if (!testName) {
    errors.push('اسم الفحص المخبري مطلوب.');
  }

  if (!patientName) {
    errors.push('اسم المريض مطلوب.');
  }

  if (errors.length > 0) {
    return ResponseHelper.unprocessable(res, errors, 'فشل طلب الفحص المخبري');
  }

  next();
};
