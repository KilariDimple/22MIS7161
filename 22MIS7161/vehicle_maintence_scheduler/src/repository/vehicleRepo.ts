import { v4 as uuid } from 'uuid';
import { Vehicle, Maintenance, CreateVehicleDto, UpdateVehicleDto, CreateMaintenanceDto, UpdateMaintenanceDto } from '../types/vehicle';
import { LogSync } from '../utils/logger';

const vehicles: Map<string, Vehicle> = new Map();
const maintenances: Map<string, Maintenance> = new Map();

export const vehicleRepo = {
  findAll(): Vehicle[] {
    LogSync('backend', 'debug', 'repository', `vehicleRepo.findAll — returning ${vehicles.size} vehicles`);
    return Array.from(vehicles.values());
  },

  findById(id: string): Vehicle | undefined {
    const v = vehicles.get(id);
    LogSync('backend', 'debug', 'repository', `vehicleRepo.findById — id=${id}, found=${!!v}`);
    return v;
  },

  create(dto: CreateVehicleDto): Vehicle {
    const now = new Date();
    const v: Vehicle = {
      id: uuid(),
      ...dto,
      createdAt: now,
      updatedAt: now
    };
    vehicles.set(v.id, v);
    LogSync('backend', 'debug', 'repository', `vehicleRepo.create — id=${v.id}, plate=${v.licensePlate}`);
    return v;
  },

  update(id: string, dto: UpdateVehicleDto): Vehicle | undefined {
    const v = vehicles.get(id);
    if (!v) {
      LogSync('backend', 'debug', 'repository', `vehicleRepo.update — id=${id} not found`);
      return undefined;
    }
    const updated: Vehicle = {
      ...v,
      ...dto,
      updatedAt: new Date()
    };
    vehicles.set(id, updated);
    LogSync('backend', 'debug', 'repository', `vehicleRepo.update — id=${id} updated`);
    return updated;
  },

  delete(id: string): boolean {
    const existed = vehicles.delete(id);
    LogSync('backend', 'debug', 'repository', `vehicleRepo.delete — id=${id}, existed=${existed}`);
    return existed;
  }
};

export const maintenanceRepo = {
  findAll(): Maintenance[] {
    LogSync('backend', 'debug', 'repository', `maintenanceRepo.findAll — returning ${maintenances.size} records`);
    return Array.from(maintenances.values());
  },

  findById(id: string): Maintenance | undefined {
    const m = maintenances.get(id);
    LogSync('backend', 'debug', 'repository', `maintenanceRepo.findById — id=${id}, found=${!!m}`);
    return m;
  },

  findByVehicleId(vehicleId: string): Maintenance[] {
    const list = Array.from(maintenances.values()).filter(m => m.vehicleId === vehicleId);
    LogSync('backend', 'debug', 'repository', `maintenanceRepo.findByVehicleId — vehicleId=${vehicleId}, count=${list.length}`);
    return list;
  },

  create(dto: CreateMaintenanceDto): Maintenance {
    const now = new Date();
    const m: Maintenance = {
      id: uuid(),
      vehicleId: dto.vehicleId,
      type: dto.type,
      description: dto.description,
      scheduledDate: new Date(dto.scheduledDate),
      status: 'scheduled',
      cost: dto.cost,
      notes: dto.notes,
      createdAt: now,
      updatedAt: now
    };
    maintenances.set(m.id, m);
    LogSync('backend', 'debug', 'repository', `maintenanceRepo.create — id=${m.id}, type=${m.type}`);
    return m;
  },

  update(id: string, dto: UpdateMaintenanceDto): Maintenance | undefined {
    const m = maintenances.get(id);
    if (!m) {
      LogSync('backend', 'debug', 'repository', `maintenanceRepo.update — id=${id} not found`);
      return undefined;
    }
    const updated: Maintenance = {
      ...m,
      ...dto,
      scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : m.scheduledDate,
      completedDate: dto.completedDate ? new Date(dto.completedDate) : m.completedDate,
      updatedAt: new Date()
    };
    maintenances.set(id, updated);
    LogSync('backend', 'debug', 'repository', `maintenanceRepo.update — id=${id} updated`);
    return updated;
  },

  delete(id: string): boolean {
    const existed = maintenances.delete(id);
    LogSync('backend', 'debug', 'repository', `maintenanceRepo.delete — id=${id}, existed=${existed}`);
    return existed;
  }
};
