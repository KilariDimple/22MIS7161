import { userRepo, notificationRepo } from '../repository/notificationRepo';
import { User, Notification, CreateUserDto, UpdateUserDto, CreateNotificationDto, UpdateNotificationDto } from '../types/notification';
import { LogSync } from '../utils/logger';

export const userSvc = {
  getAll(): User[] {
    LogSync('backend', 'info', 'service', 'userSvc.getAll — fetching all users');
    return userRepo.findAll();
  },

  getById(id: string): User | undefined {
    LogSync('backend', 'info', 'service', `userSvc.getById — id=${id}`);
    return userRepo.findById(id);
  },

  create(dto: CreateUserDto): User | null {
    const existing = userRepo.findByEmail(dto.email);
    if (existing) {
      LogSync('backend', 'warn', 'service', `userSvc.create — email ${dto.email} already exists`);
      return null;
    }
    LogSync('backend', 'info', 'service', `userSvc.create — email=${dto.email}`);
    return userRepo.create(dto);
  },

  update(id: string, dto: UpdateUserDto): User | undefined {
    LogSync('backend', 'info', 'service', `userSvc.update — id=${id}`);
    return userRepo.update(id, dto);
  },

  delete(id: string): boolean {
    LogSync('backend', 'info', 'service', `userSvc.delete — id=${id}`);
    return userRepo.delete(id);
  }
};

export const notificationSvc = {
  getAll(): Notification[] {
    LogSync('backend', 'info', 'service', 'notificationSvc.getAll — fetching all');
    return notificationRepo.findAll();
  },

  getById(id: string): Notification | undefined {
    LogSync('backend', 'info', 'service', `notificationSvc.getById — id=${id}`);
    return notificationRepo.findById(id);
  },

  getByUserId(userId: string): Notification[] {
    LogSync('backend', 'info', 'service', `notificationSvc.getByUserId — userId=${userId}`);
    return notificationRepo.findByUserId(userId);
  },

  getPending(): Notification[] {
    LogSync('backend', 'info', 'service', 'notificationSvc.getPending — fetching pending');
    return notificationRepo.findPending();
  },

  create(dto: CreateNotificationDto): Notification | null {
    const user = userRepo.findById(dto.userId);
    if (!user) {
      LogSync('backend', 'warn', 'service', `notificationSvc.create — user ${dto.userId} not found`);
      return null;
    }
    LogSync('backend', 'info', 'service', `notificationSvc.create — userId=${dto.userId}, type=${dto.type}`);
    return notificationRepo.create(dto);
  },

  update(id: string, dto: UpdateNotificationDto): Notification | undefined {
    LogSync('backend', 'info', 'service', `notificationSvc.update — id=${id}`);
    return notificationRepo.update(id, dto);
  },

  delete(id: string): boolean {
    LogSync('backend', 'info', 'service', `notificationSvc.delete — id=${id}`);
    return notificationRepo.delete(id);
  },

  send(id: string): Notification | null {
    const n = notificationRepo.findById(id);
    if (!n) {
      LogSync('backend', 'warn', 'service', `notificationSvc.send — id=${id} not found`);
      return null;
    }
    LogSync('backend', 'info', 'service', `notificationSvc.send — id=${id}, channel=${n.channel}`);
    return notificationRepo.markSent(id) || null;
  },

  markRead(id: string): Notification | null {
    const n = notificationRepo.findById(id);
    if (!n) {
      LogSync('backend', 'warn', 'service', `notificationSvc.markRead — id=${id} not found`);
      return null;
    }
    LogSync('backend', 'info', 'service', `notificationSvc.markRead — id=${id}`);
    return notificationRepo.markRead(id) || null;
  }
};
