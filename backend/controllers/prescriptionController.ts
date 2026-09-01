import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';

export const getPrescriptions = async (req: Request, res: Response) => {
  const { patient_id } = req.query as { patient_id?: string };
  const targetId = patient_id || (req.user?.role === 'PATIENT' ? req.user.id : undefined);
  const prescriptions = dbStore.getPrescriptions(targetId);
  return ResponseHelper.success(res, prescriptions);
};

export const getPrescriptionById = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const prescription = dbStore.getPrescriptionById(id);
  if (!prescription) {
    return ResponseHelper.notFound(res, 'الوصفة الطبية غير موجودة');
  }
  return ResponseHelper.success(res, prescription);
};

export const createPrescription = async (req: Request, res: Response) => {
  const payload = req.body || {};
  const newRx = dbStore.createPrescription({
    ...payload,
    doctorName: payload.doctorName || req.user?.name || 'د. هالة منير النجار',
    hospital: payload.hospital || req.user?.hospital || 'مجمع الشفاء الطبي',
    department: payload.department || req.user?.department || 'قسم الباطنة العامة'
  });

  // Timeline entry
  dbStore.timeline.unshift({
    id: 'TL-RX-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    time: '10:00 ص',
    type: 'prescription',
    title: 'إصدار وصفة طبية إلكترونية',
    subtitle: `تشخيص: ${newRx.diagnosis || 'علاج'} - ${newRx.doctorName}`,
    doctor: newRx.doctorName,
    facility: newRx.hospital,
    status: 'نشطة',
    badge: 'وصفة علاجية',
    badgeColor: 'blue'
  });

  return ResponseHelper.created(
    res,
    newRx,
    'تم إصدار الوصفة الطبية الإلكترونية وتوليد رمز الاستجابة السريعة (QR Code) للصرف'
  );
};
