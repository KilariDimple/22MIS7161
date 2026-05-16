import { Router } from 'express';
import { vehicleCtrl, maintenanceCtrl } from '../controllers/vehicleCtrl';
import { LogSync } from '../utils/logger';

const router = Router();

LogSync('backend', 'info', 'route', 'Registering vehicle and maintenance routes');

// Vehicle routes
router.get('/vehicles', vehicleCtrl.getAll);
router.get('/vehicles/:id', vehicleCtrl.getById);
router.post('/vehicles', vehicleCtrl.create);
router.put('/vehicles/:id', vehicleCtrl.update);
router.delete('/vehicles/:id', vehicleCtrl.delete);

// Vehicle maintenance
router.get('/vehicles/:vehicleId/maintenance', maintenanceCtrl.getByVehicleId);

// Maintenance routes
router.get('/maintenance', maintenanceCtrl.getAll);
router.get('/maintenance/:id', maintenanceCtrl.getById);
router.post('/maintenance', maintenanceCtrl.create);
router.put('/maintenance/:id', maintenanceCtrl.update);
router.delete('/maintenance/:id', maintenanceCtrl.delete);
router.post('/maintenance/:id/complete', maintenanceCtrl.complete);

export default router;
