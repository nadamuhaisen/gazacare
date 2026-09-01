import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './backend/app.js';
import { Logger } from './backend/utils/logger.js';

const PORT = 3000;

async function startServer() {
  // Mount Vite middleware in development mode, or static file serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    Logger.info(`[GazaCare EMR Backend] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
