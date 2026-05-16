import express from 'express';
import { getCfg } from './config/env';
import vehicleRoutes from './routes/vehicleRoutes';
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

app.use('/api', vehicleRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(cfg.port, () => {
  LogSync('backend', 'info', 'config', `Server started on port ${cfg.port}`);
  console.log(`Vehicle Maintenance Scheduler API running on http://localhost:${cfg.port}`);
  console.log(`Health check: http://localhost:${cfg.port}/health`);
  console.log(`Vehicles API: http://localhost:${cfg.port}/api/vehicles`);
});
