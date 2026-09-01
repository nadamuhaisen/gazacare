import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/apiResponse.js';
import { Logger } from '../utils/logger.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`Unhandled error on ${req.method} ${req.originalUrl}:`, err);

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'حدث خطأ غير متوقع في معالجة الطلب.';

  if (res.headersSent) {
    return next(err);
  }

  return ResponseHelper.error(res, message, status, err.errors || [message]);
};
