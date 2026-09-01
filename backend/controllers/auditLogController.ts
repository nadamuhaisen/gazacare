import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';

export const getAuditLogs = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const logs = dbStore.getAuditLogs(limit);
  return ResponseHelper.success(res, logs);
};

export const getSystemHealth = async (req: Request, res: Response) => {
  return ResponseHelper.success(res, {
    status: 'HEALTHY',
    system: 'GazaCare EMR Backend API (Node.js/Express + TypeScript)',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    activeCollections: {
      users: dbStore.users.length,
      patients: dbStore.patients.length,
      doctors: dbStore.doctors.length,
      appointments: dbStore.appointments.length,
      prescriptions: dbStore.prescriptions.length,
      labRequests: dbStore.labRequests.length,
      beds: dbStore.beds.length,
      auditLogs: dbStore.auditLogs.length
    }
  });
};
