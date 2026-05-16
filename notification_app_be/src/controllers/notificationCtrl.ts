import { Request, Response } from 'express';
import { userSvc, notificationSvc } from '../services/notificationSvc';
import { CreateUserDto, UpdateUserDto, CreateNotificationDto, UpdateNotificationDto, ApiRes } from '../types/notification';
import { LogSync } from '../utils/logger';

export const userCtrl = {
  getAll(_req: Request, res: Response): void {
    LogSync('backend', 'info', 'controller', 'GET /users — fetching all');
    const data = userSvc.getAll();
    res.json({ success: true, data } as ApiRes);
  },

  getById(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `GET /users/${id}`);
    const data = userSvc.getById(id);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `GET /users/${id} — not found`);
      res.status(404).json({ success: false, error: 'User not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data } as ApiRes);
  },

  create(req: Request, res: Response): void {
    const dto: CreateUserDto = req.body;
    LogSync('backend', 'info', 'controller', `POST /users — email=${dto.email}`);

    if (!dto.email || !dto.name) {
      LogSync('backend', 'warn', 'controller', 'POST /users — missing fields');
      res.status(400).json({ success: false, error: 'Missing required fields: email, name' } as ApiRes);
      return;
    }

    const data = userSvc.create(dto);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `POST /users — email ${dto.email} exists`);
      res.status(409).json({ success: false, error: 'Email already exists' } as ApiRes);
      return;
    }
    LogSync('backend', 'info', 'controller', `POST /users — created id=${data.id}`);
    res.status(201).json({ success: true, data, message: 'User created' } as ApiRes);
  },

  update(req: Request, res: Response): void {
    const { id } = req.params;
    const dto: UpdateUserDto = req.body;
    LogSync('backend', 'info', 'controller', `PUT /users/${id}`);

    const data = userSvc.update(id, dto);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `PUT /users/${id} — not found`);
      res.status(404).json({ success: false, error: 'User not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data, message: 'User updated' } as ApiRes);
  },

  delete(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `DELETE /users/${id}`);

    const deleted = userSvc.delete(id);
    if (!deleted) {
      LogSync('backend', 'warn', 'controller', `DELETE /users/${id} — not found`);
      res.status(404).json({ success: false, error: 'User not found' } as ApiRes);
      return;
    }
    res.json({ success: true, message: 'User deleted' } as ApiRes);
  },

  getNotifications(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `GET /users/${id}/notifications`);
    const data = notificationSvc.getByUserId(id);
    res.json({ success: true, data } as ApiRes);
  }
};

export const notificationCtrl = {
  getAll(_req: Request, res: Response): void {
    LogSync('backend', 'info', 'controller', 'GET /notifications — fetching all');
    const data = notificationSvc.getAll();
    res.json({ success: true, data } as ApiRes);
  },

  getPending(_req: Request, res: Response): void {
    LogSync('backend', 'info', 'controller', 'GET /notifications/pending');
    const data = notificationSvc.getPending();
    res.json({ success: true, data } as ApiRes);
  },

  getById(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `GET /notifications/${id}`);
    const data = notificationSvc.getById(id);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `GET /notifications/${id} — not found`);
      res.status(404).json({ success: false, error: 'Notification not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data } as ApiRes);
  },

  create(req: Request, res: Response): void {
    const dto: CreateNotificationDto = req.body;
    LogSync('backend', 'info', 'controller', `POST /notifications — userId=${dto.userId}`);

    if (!dto.userId || !dto.type || !dto.channel || !dto.title || !dto.body) {
      LogSync('backend', 'warn', 'controller', 'POST /notifications — missing fields');
      res.status(400).json({ success: false, error: 'Missing required fields: userId, type, channel, title, body' } as ApiRes);
      return;
    }

    const data = notificationSvc.create(dto);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `POST /notifications — user ${dto.userId} not found`);
      res.status(404).json({ success: false, error: 'User not found' } as ApiRes);
      return;
    }
    LogSync('backend', 'info', 'controller', `POST /notifications — created id=${data.id}`);
    res.status(201).json({ success: true, data, message: 'Notification created' } as ApiRes);
  },

  update(req: Request, res: Response): void {
    const { id } = req.params;
    const dto: UpdateNotificationDto = req.body;
    LogSync('backend', 'info', 'controller', `PUT /notifications/${id}`);

    const data = notificationSvc.update(id, dto);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `PUT /notifications/${id} — not found`);
      res.status(404).json({ success: false, error: 'Notification not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data, message: 'Notification updated' } as ApiRes);
  },

  delete(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `DELETE /notifications/${id}`);

    const deleted = notificationSvc.delete(id);
    if (!deleted) {
      LogSync('backend', 'warn', 'controller', `DELETE /notifications/${id} — not found`);
      res.status(404).json({ success: false, error: 'Notification not found' } as ApiRes);
      return;
    }
    res.json({ success: true, message: 'Notification deleted' } as ApiRes);
  },

  send(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `POST /notifications/${id}/send`);

    const data = notificationSvc.send(id);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `POST /notifications/${id}/send — not found`);
      res.status(404).json({ success: false, error: 'Notification not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data, message: 'Notification sent' } as ApiRes);
  },

  markRead(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `POST /notifications/${id}/read`);

    const data = notificationSvc.markRead(id);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `POST /notifications/${id}/read — not found`);
      res.status(404).json({ success: false, error: 'Notification not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data, message: 'Notification marked as read' } as ApiRes);
  }
};
