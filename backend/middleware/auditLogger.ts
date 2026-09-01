import { Request, Response, NextFunction } from 'express';
import { dbStore } from '../config/database.js';

export const auditAccess = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const actor = req.user
      ? { id: req.user.id, name: req.user.name, role: req.user.role }
      : { id: 'anonymous', name: 'زائر / غير مسجل', role: 'GUEST' };

    const targetId = (req.params.id || req.query.id || req.query.patient_id || req.body?.patientId) as string;
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    // Log the audit event asynchronously
    try {
      dbStore.logAudit(actor, action, resource, targetId, targetId, ip, {
        method: req.method,
        path: req.originalUrl
      });
    } catch (e) {
      console.error('Audit log failed', e);
    }

    next();
  };
};
