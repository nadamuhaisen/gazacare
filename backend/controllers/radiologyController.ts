import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';

export const getRadiology = async (req: Request, res: Response) => {
  return ResponseHelper.success(res, dbStore.radiology);
};

export const requestRadiology = async (req: Request, res: Response) => {
  const newRad = {
    id: 'RAD-REQ-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    status: 'مجدول',
    doctorName: req.user?.name || 'د. هالة منير النجار',
    ...req.body
  };
  dbStore.radiology.unshift(newRad);
  return ResponseHelper.created(res, newRad, 'تم إرسال طلب الأشعة والتصوير الطبي بنجاح');
};
