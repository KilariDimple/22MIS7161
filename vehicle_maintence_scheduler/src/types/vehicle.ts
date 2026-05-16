export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Maintenance {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: MaintenanceStatus;
  cost?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MaintenanceType =
  | 'oil_change'
  | 'tire_rotation'
  | 'brake_inspection'
  | 'fluid_check'
  | 'filter_replacement'
  | 'battery_check'
  | 'general_service'
  | 'repair';

export type MaintenanceStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface CreateVehicleDto {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  ownerId: string;
}

export interface UpdateVehicleDto {
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  ownerId?: string;
}

export interface CreateMaintenanceDto {
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: string;
  cost?: number;
  notes?: string;
}

export interface UpdateMaintenanceDto {
  type?: MaintenanceType;
  description?: string;
  scheduledDate?: string;
  completedDate?: string;
  status?: MaintenanceStatus;
  cost?: number;
  notes?: string;
}

export interface ApiRes<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
