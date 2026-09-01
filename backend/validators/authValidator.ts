import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/apiResponse.js';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body || {};
  const errors: string[] = [];

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('البريد الإلكتروني أو رقم الهوية أو الرقم الوظيفي مطلوب.');
  }

  if (errors.length > 0) {
    return ResponseHelper.unprocessable(res, errors, 'فشل التحقق من صحة بيانات الدخول');
  }

  next();
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, fullName, email, phone, role, nationalId } = req.body || {};
  const errors: string[] = [];

  const displayName = fullName || name;
  if (!displayName || typeof displayName !== 'string' || displayName.trim().length < 3) {
    errors.push('الاسم الكامل مطلوب ويجب ألا يقل عن 3 أحرف.');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('صيغة البريد الإلكتروني غير صالحة.');
  }

  if (nationalId && nationalId.toString().length !== 9) {
    errors.push('رقم الهوية الفلسطينية يجب أن يتكون من 9 أرقام.');
  }

  if (errors.length > 0) {
    return ResponseHelper.unprocessable(res, errors, 'فشل التحقق من بيانات التسجيل');
  }

  next();
};
