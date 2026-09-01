import { Response } from 'express';
import { HttpStatus } from '../config/constants.js';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp?: string;
}

export class ResponseHelper {
  static success<T>(res: Response, data?: T, message?: string, statusCode: HttpStatus = HttpStatus.OK) {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data?: T, message: string = 'تم الإنشاء بنجاح') {
    return this.success(res, data, message, HttpStatus.CREATED);
  }

  static error(res: Response, message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST, errors?: any[]) {
    const payload: ApiResponse = {
      success: false,
      message,
      errors: errors || [message],
      timestamp: new Date().toISOString()
    };
    return res.status(statusCode).json(payload);
  }

  static unauthorized(res: Response, message: string = 'غير مصرح لك بالوصول. يرجى تسجيل الدخول.') {
    return this.error(res, message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(res: Response, message: string = 'ليس لديك صلاحية لتنفيذ هذا الإجراء.') {
    return this.error(res, message, HttpStatus.FORBIDDEN);
  }

  static notFound(res: Response, message: string = 'السجل المطلوب غير موجود.') {
    return this.error(res, message, HttpStatus.NOT_FOUND);
  }

  static unprocessable(res: Response, errors: any[], message: string = 'بيانات الإدخال غير صالحة.') {
    return this.error(res, message, HttpStatus.UNPROCESSABLE_ENTITY, errors);
  }

  static internalError(res: Response, message: string = 'حدث خطأ داخلي في الخادم.') {
    return this.error(res, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
