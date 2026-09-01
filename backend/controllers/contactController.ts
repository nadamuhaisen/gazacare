import { Request, Response } from 'express';
import { dbStore } from '../config/database.js';
import { ResponseHelper } from '../utils/apiResponse.js';
import { Logger } from '../utils/logger.js';

export const emergencyHotlines = [
  {
    title: 'الإسعاف والطوارئ - الهلال الأحمر الفلسطيني',
    number: '101',
    description: 'خط الطوارئ المركزي للإسعاف الفوري ونقل الحالات الحرجة في كافة محافظات غزة',
    availability: '24/7 على مدار الساعة',
    type: 'emergency'
  },
  {
    title: 'غرفة طوارئ وزارة الصحة الفلسطينية',
    number: '103',
    description: 'الاستفسارات الطبية الطارئة، التحويلات العاجلة، ومتابعة نقص الأدوية التخصصية',
    availability: '24/7 على مدار الساعة',
    type: 'moh'
  },
  {
    title: 'مكتب الدعم الفني وإدارة السجلات EMR',
    number: '+970 8 282 0000',
    description: 'الدعم التقني لربط المستشفيات وحل مشكلات مزامنة الملفات والحسابات الطبية',
    availability: 'من 8:00 ص حتى 10:00 م',
    type: 'support'
  },
  {
    title: 'الخط الساخن للاستشارات الطبية والنفسية',
    number: '1800 100 200',
    description: 'استشارات أطباء الأسرة والدعم النفسي الميداني للنازحين والمتضررين',
    availability: 'من 9:00 ص حتى 8:00 م',
    type: 'consultation'
  }
];

export const submitContactMessage = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      nationalId,
      category,
      priority,
      subject,
      message,
      hospital
    } = req.body || {};

    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || '127.0.0.1';

    const savedMessage = dbStore.saveContactMessage(
      {
        name,
        email,
        phone,
        nationalId,
        category: category || 'general_inquiry',
        priority: priority || 'normal',
        subject,
        message,
        hospital: hospital || 'مجمع الشفاء الطبي'
      },
      ipAddress
    );

    Logger.info(`Contact message received [${savedMessage.ticketNumber}] from ${savedMessage.name} (${savedMessage.email})`);

    // Audit log entry
    dbStore.logAudit(
      req.user ? { id: req.user.id, name: req.user.name, role: req.user.role } : { id: 'GUEST', name: name, role: 'GUEST' },
      'CONTACT_SUBMISSION',
      'ContactMessage',
      savedMessage.id,
      savedMessage.ticketNumber,
      ipAddress,
      { subject: savedMessage.subject, priority: savedMessage.priority, category: savedMessage.category }
    );

    return ResponseHelper.created(
      res,
      {
        ticket: savedMessage,
        ticketNumber: savedMessage.ticketNumber,
        estimatedResponseTime: savedMessage.priority === 'emergency' ? 'خلال ساعتين' : savedMessage.priority === 'urgent' ? 'خلال 6 ساعات' : 'خلال 24 ساعة'
      },
      `تم استلام رسالتكم بنجاح وتم توليد تذكرة متابعة برقم (${savedMessage.ticketNumber}). سيتواصل معكم الفريق المختص في أقرب وقت.`
    );
  } catch (error: any) {
    Logger.error(`Error processing contact submission: ${error?.message}`);
    return ResponseHelper.serverError(res, 'حدث خطأ أثناء معالجة وإرسال رسالتكم، يرجى المحاولة لاحقاً');
  }
};

export const getContactMessages = async (req: Request, res: Response) => {
  const { status, category } = req.query as { status?: string; category?: string };
  const messages = dbStore.getContactMessages(status, category);
  return ResponseHelper.success(res, messages);
};

export const getContactMessageById = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const msg = dbStore.getContactMessageById(id);
  if (!msg) {
    return ResponseHelper.notFound(res, 'لم يتم العثور على تذكرة التواصل المطلوبة');
  }
  return ResponseHelper.success(res, msg);
};

export const updateContactStatus = async (req: Request, res: Response) => {
  const id = (req.params.id || req.query.id) as string;
  const { status, notes } = req.body || {};

  if (!status || !['pending', 'in_progress', 'resolved'].includes(status)) {
    return ResponseHelper.unprocessable(res, ['حالة التذكرة يجب أن تكون (pending, in_progress, resolved)'], 'حالة غير صالحة');
  }

  const updated = dbStore.updateContactMessageStatus(id, status, notes);
  if (!updated) {
    return ResponseHelper.notFound(res, 'تذكرة التواصل غير موجودة');
  }

  if (req.user) {
    dbStore.logAudit(
      { id: req.user.id, name: req.user.name, role: req.user.role },
      'CONTACT_STATUS_UPDATE',
      'ContactMessage',
      updated.id,
      updated.ticketNumber,
      req.ip,
      { newStatus: status, notes }
    );
  }

  return ResponseHelper.success(res, updated, 'تم تحديث حالة تذكرة المتابعة بنجاح');
};

export const getEmergencyHotlines = async (req: Request, res: Response) => {
  return ResponseHelper.success(res, emergencyHotlines);
};
