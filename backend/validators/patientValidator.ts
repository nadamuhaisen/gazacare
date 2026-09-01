import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/apiResponse.js';

export const validateVitals = (req: Request, res: Response, next: NextFunction) => {
  const { hr, bpSys, bpDia, temp, spo2 } = req.body || {};
  const errors: string[] = [];

  if (hr !== undefined && (isNaN(Number(hr)) || Number(hr) < 30 || Number(hr) > 250)) {
    errors.push('معدل نبضات القلب يجب أن يكون قيمة منطقية بين 30 و 250 نبضة/دقيقة.');
  }

  if (bpSys !== undefined && (isNaN(Number(bpSys)) || Number(bpSys) < 50 || Number(bpSys) > 260)) {
    errors.push('ضغط الدم الانقباضي غير صحيح.');
  }

  if (bpDia !== undefined && (isNaN(Number(bpDia)) || Number(bpDia) < 30 || Number(bpDia) > 160)) {
    errors.push('ضغط الدم الانبساطي غير صحيح.');
  }

  if (temp !== undefined && (isNaN(Number(temp)) || Number(temp) < 30 || Number(temp) > 45)) {
    errors.push('درجة حرارة الجسم يجب أن تكون بين 30 و 45 درجة مئوية.');
  }

  if (spo2 !== undefined && (isNaN(Number(spo2)) || Number(spo2) < 40 || Number(spo2) > 100)) {
    errors.push('نسبة تشبع الأكسجين SpO2 يجب أن تكون بين 40% و 100%.');
  }

  if (errors.length > 0) {
    return ResponseHelper.unprocessable(res, errors, 'فشل التحقق من صحة المؤشرات الحيوية');
  }

  next();
};

export const validatePatientCreate = (req: Request, res: Response, next: NextFunction) => {
  const { name, nationalId } = req.body || {};
  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    errors.push('اسم المريض مطلوب بالكامل.');
  }

  if (errors.length > 0) {
    return ResponseHelper.unprocessable(res, errors, 'بيانات المريض غير مكتملة');
  }

  next();
};
