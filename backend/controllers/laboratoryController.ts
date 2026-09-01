import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';

export const getLabRequests = async (req: Request, res: Response) => {
  const { status, priority } = req.query as { status?: string; priority?: string };
  const requests = dbStore.getLabRequests(status, priority);
  return ResponseHelper.success(res, requests);
};

export const getLabRequestById = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const labReq = dbStore.getLabRequestById(id);
  if (!labReq) {
    return ResponseHelper.notFound(res, 'طلب الفحص المخبري غير موجود');
  }
  return ResponseHelper.success(res, labReq);
};

export const createLabRequest = async (req: Request, res: Response) => {
  const payload = req.body || {};
  const newReq = dbStore.createLabRequest({
    ...payload,
    doctorName: payload.doctorName || req.user?.name || 'د. هالة منير النجار'
  });

  return ResponseHelper.created(res, newReq, 'تم إرسال طلب الفحص المخبري إلى قسم المختبرات بنجاح');
};

export const saveLabResult = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const resultData = req.body || {};

  const updated = dbStore.saveLabResult(id, {
    ...resultData,
    verifiedBy: req.user?.name || resultData.verifiedBy || 'أ. خليل عادل المصري'
  });

  if (!updated) {
    return ResponseHelper.notFound(res, 'طلب الفحص غير موجود لحفظ نتائجه');
  }

  return ResponseHelper.success(res, updated, 'تم اعتماد نتائج التحليل وتحديث السجل الطبي للمريض');
};

export const markLabCritical = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const { note } = req.body || {};

  const updated = dbStore.markLabCritical(id, note);
  if (!updated) {
    return ResponseHelper.notFound(res, 'طلب الفحص غير موجود لتصنيفه كحرج');
  }

  return ResponseHelper.success(
    res,
    updated,
    'تم تصنيف الفحص كحالة حرجة وإرسال إشعار فوري للطبيب المعالج'
  );
};
