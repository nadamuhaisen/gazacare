import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { Logger } from './utils/logger.js';

export const createApp = (): Express => {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
    })
  );

  // Body parsers
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Request logger middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    Logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  // Mount API routers for both /api and /backend/api (for PHP path compatibility)
  app.use('/api', apiRouter);
  app.use('/backend/api', apiRouter);
  app.use('/gazacare/backend/api', apiRouter);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
};

export default createApp();
