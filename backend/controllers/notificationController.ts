import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';

export const getNotifications = async (req: Request, res: Response) => {
  const { role } = req.query as { role?: string };
  const targetRole = role || req.user?.role;
  const notifications = dbStore.getNotifications(targetRole);
  return ResponseHelper.success(res, notifications);
};

export const markNotificationRead = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const updated = dbStore.markNotificationRead(id);
  return ResponseHelper.success(res, updated, 'تم تحديث حالة الإشعار');
};

export const markAllNotificationsRead = async (req: Request, res: Response) => {
  const { role } = req.body || {};
  const targetRole = role || req.user?.role;
  dbStore.markAllNotificationsRead(targetRole);
  return ResponseHelper.success(res, null, 'تم تعيين جميع الإشعارات كمقروءة');
};
