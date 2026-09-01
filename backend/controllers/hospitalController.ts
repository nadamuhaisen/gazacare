import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';

export const getHospitals = async (req: Request, res: Response) => {
  return ResponseHelper.success(res, dbStore.hospitals);
};

export const getDepartments = async (req: Request, res: Response) => {
  return ResponseHelper.success(res, dbStore.departments);
};

export const getBeds = async (req: Request, res: Response) => {
  const { department, status } = req.query as { department?: string; status?: string };
  const beds = dbStore.getBeds(department, status);
  return ResponseHelper.success(res, beds);
};

export const updateBed = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const { status, ...details } = req.body || {};

  const updated = dbStore.updateBed(id, status, details);
  if (!updated) {
    return ResponseHelper.notFound(res, 'السرير السريري غير موجود لتحديثه');
  }

  return ResponseHelper.success(res, updated, 'تم تحديث حالة السرير السريري وتوزيع المرضى بنجاح');
};

export const getStaff = async (req: Request, res: Response) => {
  return ResponseHelper.success(res, dbStore.staff);
};

export const getHospitalAnalytics = async (req: Request, res: Response) => {
  const totalBeds = dbStore.beds.length;
  const occupiedBeds = dbStore.beds.filter((b) => b.status === 'occupied').length;
  const availableBeds = dbStore.beds.filter((b) => b.status === 'available').length;
  const reservedBeds = dbStore.beds.filter((b) => b.status === 'reserved').length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 85;

  return ResponseHelper.success(res, {
    ...dbStore.stats,
    bedOccupancy: {
      total: totalBeds,
      occupied: occupiedBeds,
      available: availableBeds,
      reserved: reservedBeds,
      rate: occupancyRate
    }
  });
};
