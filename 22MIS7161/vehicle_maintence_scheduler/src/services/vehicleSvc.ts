import { vehicleRepo, maintenanceRepo } from '../repository/vehicleRepo';
import { Vehicle, Maintenance, CreateVehicleDto, UpdateVehicleDto, CreateMaintenanceDto, UpdateMaintenanceDto } from '../types/vehicle';
import { LogSync } from '../utils/logger';

export const vehicleSvc = {
  getAll(): Vehicle[] {
    LogSync('backend', 'info', 'service', 'vehicleSvc.getAll — fetching all vehicles');
    return vehicleRepo.findAll();
  },

  getById(id: string): Vehicle | undefined {
    LogSync('backend', 'info', 'service', `vehicleSvc.getById — id=${id}`);
    return vehicleRepo.findById(id);
  },

  create(dto: CreateVehicleDto): Vehicle {
    LogSync('backend', 'info', 'service', `vehicleSvc.create — make=${dto.make}, model=${dto.model}`);
    return vehicleRepo.create(dto);
  },

  update(id: string, dto: UpdateVehicleDto): Vehicle | undefined {
    LogSync('backend', 'info', 'service', `vehicleSvc.update — id=${id}`);
    return vehicleRepo.update(id, dto);
  },

  delete(id: string): boolean {
    LogSync('backend', 'info', 'service', `vehicleSvc.delete — id=${id}`);
    return vehicleRepo.delete(id);
  }
};

export const maintenanceSvc = {
  getAll(): Maintenance[] {
    LogSync('backend', 'info', 'service', 'maintenanceSvc.getAll — fetching all records');
    return maintenanceRepo.findAll();
  },

  getById(id: string): Maintenance | undefined {
    LogSync('backend', 'info', 'service', `maintenanceSvc.getById — id=${id}`);
    return maintenanceRepo.findById(id);
  },

  getByVehicleId(vehicleId: string): Maintenance[] {
    LogSync('backend', 'info', 'service', `maintenanceSvc.getByVehicleId — vehicleId=${vehicleId}`);
    return maintenanceRepo.findByVehicleId(vehicleId);
  },

  create(dto: CreateMaintenanceDto): Maintenance | null {
    const vehicle = vehicleRepo.findById(dto.vehicleId);
    if (!vehicle) {
      LogSync('backend', 'warn', 'service', `maintenanceSvc.create — vehicle ${dto.vehicleId} not found`);
      return null;
    }
    LogSync('backend', 'info', 'service', `maintenanceSvc.create — vehicleId=${dto.vehicleId}, type=${dto.type}`);
    return maintenanceRepo.create(dto);
  },

  update(id: string, dto: UpdateMaintenanceDto): Maintenance | undefined {
    LogSync('backend', 'info', 'service', `maintenanceSvc.update — id=${id}`);
    return maintenanceRepo.update(id, dto);
  },

  delete(id: string): boolean {
    LogSync('backend', 'info', 'service', `maintenanceSvc.delete — id=${id}`);
    return maintenanceRepo.delete(id);
  },

  complete(id: string): Maintenance | undefined {
    LogSync('backend', 'info', 'service', `maintenanceSvc.complete — id=${id}`);
    return maintenanceRepo.update(id, {
      status: 'completed',
      completedDate: new Date().toISOString()
    });
  }
};
