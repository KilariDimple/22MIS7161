import { Request, Response } from 'express';
import { vehicleSvc, maintenanceSvc } from '../services/vehicleSvc';
import { CreateVehicleDto, UpdateVehicleDto, CreateMaintenanceDto, UpdateMaintenanceDto, ApiRes } from '../types/vehicle';
import { LogSync } from '../utils/logger';

export const vehicleCtrl = {
  getAll(req: Request, res: Response): void {
    LogSync('backend', 'info', 'controller', 'GET /vehicles — fetching all');
    const data = vehicleSvc.getAll();
    res.json({ success: true, data } as ApiRes);
  },

  getById(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `GET /vehicles/${id}`);
    const data = vehicleSvc.getById(id);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `GET /vehicles/${id} — not found`);
      res.status(404).json({ success: false, error: 'Vehicle not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data } as ApiRes);
  },

  create(req: Request, res: Response): void {
    const dto: CreateVehicleDto = req.body;
    LogSync('backend', 'info', 'controller', `POST /vehicles — make=${dto.make}`);

    if (!dto.make || !dto.model || !dto.year || !dto.licensePlate || !dto.ownerId) {
      LogSync('backend', 'warn', 'controller', 'POST /vehicles — missing fields');
      res.status(400).json({ success: false, error: 'Missing required fields: make, model, year, licensePlate, ownerId' } as ApiRes);
      return;
    }

    const data = vehicleSvc.create(dto);
    LogSync('backend', 'info', 'controller', `POST /vehicles — created id=${data.id}`);
    res.status(201).json({ success: true, data, message: 'Vehicle created' } as ApiRes);
  },

  update(req: Request, res: Response): void {
    const { id } = req.params;
    const dto: UpdateVehicleDto = req.body;
    LogSync('backend', 'info', 'controller', `PUT /vehicles/${id}`);

    const data = vehicleSvc.update(id, dto);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `PUT /vehicles/${id} — not found`);
      res.status(404).json({ success: false, error: 'Vehicle not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data, message: 'Vehicle updated' } as ApiRes);
  },

  delete(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `DELETE /vehicles/${id}`);

    const deleted = vehicleSvc.delete(id);
    if (!deleted) {
      LogSync('backend', 'warn', 'controller', `DELETE /vehicles/${id} — not found`);
      res.status(404).json({ success: false, error: 'Vehicle not found' } as ApiRes);
      return;
    }
    res.json({ success: true, message: 'Vehicle deleted' } as ApiRes);
  }
};

export const maintenanceCtrl = {
  getAll(req: Request, res: Response): void {
    LogSync('backend', 'info', 'controller', 'GET /maintenance — fetching all');
    const data = maintenanceSvc.getAll();
    res.json({ success: true, data } as ApiRes);
  },

  getById(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `GET /maintenance/${id}`);
    const data = maintenanceSvc.getById(id);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `GET /maintenance/${id} — not found`);
      res.status(404).json({ success: false, error: 'Maintenance record not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data } as ApiRes);
  },

  getByVehicleId(req: Request, res: Response): void {
    const { vehicleId } = req.params;
    LogSync('backend', 'info', 'controller', `GET /vehicles/${vehicleId}/maintenance`);
    const data = maintenanceSvc.getByVehicleId(vehicleId);
    res.json({ success: true, data } as ApiRes);
  },

  create(req: Request, res: Response): void {
    const dto: CreateMaintenanceDto = req.body;
    LogSync('backend', 'info', 'controller', `POST /maintenance — vehicleId=${dto.vehicleId}`);

    if (!dto.vehicleId || !dto.type || !dto.description || !dto.scheduledDate) {
      LogSync('backend', 'warn', 'controller', 'POST /maintenance — missing fields');
      res.status(400).json({ success: false, error: 'Missing required fields: vehicleId, type, description, scheduledDate' } as ApiRes);
      return;
    }

    const data = maintenanceSvc.create(dto);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `POST /maintenance — vehicle ${dto.vehicleId} not found`);
      res.status(404).json({ success: false, error: 'Vehicle not found' } as ApiRes);
      return;
    }
    LogSync('backend', 'info', 'controller', `POST /maintenance — created id=${data.id}`);
    res.status(201).json({ success: true, data, message: 'Maintenance scheduled' } as ApiRes);
  },

  update(req: Request, res: Response): void {
    const { id } = req.params;
    const dto: UpdateMaintenanceDto = req.body;
    LogSync('backend', 'info', 'controller', `PUT /maintenance/${id}`);

    const data = maintenanceSvc.update(id, dto);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `PUT /maintenance/${id} — not found`);
      res.status(404).json({ success: false, error: 'Maintenance record not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data, message: 'Maintenance updated' } as ApiRes);
  },

  delete(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `DELETE /maintenance/${id}`);

    const deleted = maintenanceSvc.delete(id);
    if (!deleted) {
      LogSync('backend', 'warn', 'controller', `DELETE /maintenance/${id} — not found`);
      res.status(404).json({ success: false, error: 'Maintenance record not found' } as ApiRes);
      return;
    }
    res.json({ success: true, message: 'Maintenance deleted' } as ApiRes);
  },

  complete(req: Request, res: Response): void {
    const { id } = req.params;
    LogSync('backend', 'info', 'controller', `POST /maintenance/${id}/complete`);

    const data = maintenanceSvc.complete(id);
    if (!data) {
      LogSync('backend', 'warn', 'controller', `POST /maintenance/${id}/complete — not found`);
      res.status(404).json({ success: false, error: 'Maintenance record not found' } as ApiRes);
      return;
    }
    res.json({ success: true, data, message: 'Maintenance marked complete' } as ApiRes);
  }
};
