import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';

export const getMedicalRecord = async (req: Request, res: Response) => {
  const patientId = (req.params.id || req.query.patient_id || req.user?.id || 'P-10492') as string;

  const patient = dbStore.getPatientById(patientId) || dbStore.patients[0];
  const vitals = dbStore.vitalSigns;
  const radiology = dbStore.radiology;
  const clinicalNotes = dbStore.clinicalNotes;
  const labs = dbStore.labRequests;
  const prescriptions = dbStore.getPrescriptions(patientId);

  return ResponseHelper.success(res, {
    patient,
    vitals,
    radiology,
    clinicalNotes,
    labs,
    prescriptions
  });
};

export const getClinicalNotes = async (req: Request, res: Response) => {
  return ResponseHelper.success(res, dbStore.clinicalNotes);
};
