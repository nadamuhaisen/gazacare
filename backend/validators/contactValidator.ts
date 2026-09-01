import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/apiResponse.js';

export const validateContactMessage = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, subject, message } = req.body || {};
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('الاسم الكامل مطلوب ويجب ألا يقل عن حرفين.');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('البريد الإلكتروني مطلوب بصيغة صحيحة للتواصل معك.');
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    errors.push('موضوع الرسالة مطلوب ويجب توضيحه بدقة.');
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push('نص الرسالة مطلوب ويجب ألا يقل عن 10 أحرف لتوضيح التفاصيل.');
  }

  if (errors.length > 0) {
    return ResponseHelper.unprocessable(res, errors, 'فشل التحقق من صحة بيانات نموذج التواصل');
  }

  next();
};
