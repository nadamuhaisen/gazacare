import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';

export const getAppointments = async (req: Request, res: Response) => {
  const { patient_id, doctor_id, status } = req.query as {
    patient_id?: string;
    doctor_id?: string;
    status?: string;
  };
  const appointments = dbStore.getAppointments(patient_id, doctor_id, status);
  return ResponseHelper.success(res, appointments);
};

export const getAppointmentById = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const appointment = dbStore.getAppointmentById(id);
  if (!appointment) {
    return ResponseHelper.notFound(res, 'الموعد غير موجود');
  }
  return ResponseHelper.success(res, appointment);
};

export const createAppointment = async (req: Request, res: Response) => {
  const payload = req.body || {};
  const newApt = dbStore.createAppointment({
    ...payload,
    patientName: payload.patientName || req.user?.name || 'أحمد يوسف خليل',
    patientMrn: payload.patientMrn || req.user?.mrn || 'P-10492'
  });

  return ResponseHelper.created(res, newApt, 'تم حجز الموعد الطبي بنجاح وهو قيد التأكيد من العيادة');
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const { status, notes } = req.body || {};

  const updated = dbStore.updateAppointmentStatus(id, status, notes);
  if (!updated) {
    return ResponseHelper.notFound(res, 'الموعد غير موجود لتحديث حالته');
  }

  return ResponseHelper.success(res, updated, `تم تحديث حالة الموعد إلى (${status}) بنجاح`);
};

export const cancelAppointment = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const { reason } = req.body || {};

  const updated = dbStore.updateAppointmentStatus(id, 'ملغي', reason);
  if (!updated) {
    return ResponseHelper.notFound(res, 'الموعد المطلوب إلغاؤه غير موجود');
  }

  return ResponseHelper.success(res, updated, 'تم إلغاء الموعد الطبي بنجاح');
};
