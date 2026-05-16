import express from 'express';
import { getCfg } from './config/env';
import notificationRoutes from './routes/notificationRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { reqLogger } from './middleware/reqLogger';
import { LogSync } from './utils/logger';

const app = express();
const cfg = getCfg();

app.use(express.json());
app.use(reqLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', notificationRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(cfg.port, () => {
  LogSync('backend', 'info', 'config', `Server started on port ${cfg.port}`);
  console.log(`Notification App API running on http://localhost:${cfg.port}`);
  console.log(`Health check: http://localhost:${cfg.port}/health`);
  console.log(`Users API: http://localhost:${cfg.port}/api/users`);
  console.log(`Notifications API: http://localhost:${cfg.port}/api/notifications`);
});
