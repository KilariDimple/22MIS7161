import { Router } from 'express';
import { userCtrl, notificationCtrl } from '../controllers/notificationCtrl';
import { LogSync } from '../utils/logger';

const router = Router();

LogSync('backend', 'info', 'route', 'Registering user and notification routes');

// User routes
router.get('/users', userCtrl.getAll);
router.get('/users/:id', userCtrl.getById);
router.post('/users', userCtrl.create);
router.put('/users/:id', userCtrl.update);
router.delete('/users/:id', userCtrl.delete);
router.get('/users/:id/notifications', userCtrl.getNotifications);

// Notification routes
router.get('/notifications', notificationCtrl.getAll);
router.get('/notifications/pending', notificationCtrl.getPending);
router.get('/notifications/:id', notificationCtrl.getById);
router.post('/notifications', notificationCtrl.create);
router.put('/notifications/:id', notificationCtrl.update);
router.delete('/notifications/:id', notificationCtrl.delete);
router.post('/notifications/:id/send', notificationCtrl.send);
router.post('/notifications/:id/read', notificationCtrl.markRead);

export default router;
