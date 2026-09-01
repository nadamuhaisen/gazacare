import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/apiResponse.js';

export const validateAppointmentCreate = (req: Request, res: Response, next: NextFunction) => {
  const { doctorName, department, date } = req.body || {};
  const errors: string[] = [];

  if (!doctorName && !department) {
    errors.push('يرجى تحديد الطبيب المعالج أو القسم المختص.');
  }

  if (!date) {
    errors.push('تاريخ الموعد مطلوب.');
  }

  if (errors.length > 0) {
    return ResponseHelper.unprocessable(res, errors, 'فشل التحقق من بيانات حجز الموعد');
  }

  next();
};
