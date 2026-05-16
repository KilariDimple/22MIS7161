import { v4 as uuid } from 'uuid';
import { User, Notification, CreateUserDto, UpdateUserDto, CreateNotificationDto, UpdateNotificationDto } from '../types/notification';
import { LogSync } from '../utils/logger';

const users: Map<string, User> = new Map();
const notifications: Map<string, Notification> = new Map();

export const userRepo = {
  findAll(): User[] {
    LogSync('backend', 'debug', 'repository', `userRepo.findAll — returning ${users.size} users`);
    return Array.from(users.values());
  },

  findById(id: string): User | undefined {
    const u = users.get(id);
    LogSync('backend', 'debug', 'repository', `userRepo.findById — id=${id}, found=${!!u}`);
    return u;
  },

  findByEmail(email: string): User | undefined {
    const u = Array.from(users.values()).find(u => u.email === email);
    LogSync('backend', 'debug', 'repository', `userRepo.findByEmail — email=${email}, found=${!!u}`);
    return u;
  },

  create(dto: CreateUserDto): User {
    const now = new Date();
    const u: User = {
      id: uuid(),
      email: dto.email,
      name: dto.name,
      preferences: {
        email: dto.preferences?.email ?? true,
        push: dto.preferences?.push ?? true,
        sms: dto.preferences?.sms ?? false
      },
      createdAt: now,
      updatedAt: now
    };
    users.set(u.id, u);
    LogSync('backend', 'debug', 'repository', `userRepo.create — id=${u.id}, email=${u.email}`);
    return u;
  },

  update(id: string, dto: UpdateUserDto): User | undefined {
    const u = users.get(id);
    if (!u) {
      LogSync('backend', 'debug', 'repository', `userRepo.update — id=${id} not found`);
      return undefined;
    }
    const updated: User = {
      ...u,
      email: dto.email ?? u.email,
      name: dto.name ?? u.name,
      preferences: dto.preferences ? { ...u.preferences, ...dto.preferences } : u.preferences,
      updatedAt: new Date()
    };
    users.set(id, updated);
    LogSync('backend', 'debug', 'repository', `userRepo.update — id=${id} updated`);
    return updated;
  },

  delete(id: string): boolean {
    const existed = users.delete(id);
    LogSync('backend', 'debug', 'repository', `userRepo.delete — id=${id}, existed=${existed}`);
    return existed;
  }
};

export const notificationRepo = {
  findAll(): Notification[] {
    LogSync('backend', 'debug', 'repository', `notificationRepo.findAll — returning ${notifications.size} notifications`);
    return Array.from(notifications.values());
  },

  findById(id: string): Notification | undefined {
    const n = notifications.get(id);
    LogSync('backend', 'debug', 'repository', `notificationRepo.findById — id=${id}, found=${!!n}`);
    return n;
  },

  findByUserId(userId: string): Notification[] {
    const list = Array.from(notifications.values()).filter(n => n.userId === userId);
    LogSync('backend', 'debug', 'repository', `notificationRepo.findByUserId — userId=${userId}, count=${list.length}`);
    return list;
  },

  findPending(): Notification[] {
    const list = Array.from(notifications.values()).filter(n => n.status === 'pending' || n.status === 'scheduled');
    LogSync('backend', 'debug', 'repository', `notificationRepo.findPending — count=${list.length}`);
    return list;
  },

  create(dto: CreateNotificationDto): Notification {
    const now = new Date();
    const n: Notification = {
      id: uuid(),
      userId: dto.userId,
      type: dto.type,
      channel: dto.channel,
      title: dto.title,
      body: dto.body,
      status: dto.scheduledAt ? 'scheduled' : 'pending',
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      metadata: dto.metadata,
      createdAt: now,
      updatedAt: now
    };
    notifications.set(n.id, n);
    LogSync('backend', 'debug', 'repository', `notificationRepo.create — id=${n.id}, type=${n.type}`);
    return n;
  },

  update(id: string, dto: UpdateNotificationDto): Notification | undefined {
    const n = notifications.get(id);
    if (!n) {
      LogSync('backend', 'debug', 'repository', `notificationRepo.update — id=${id} not found`);
      return undefined;
    }
    const updated: Notification = {
      ...n,
      title: dto.title ?? n.title,
      body: dto.body ?? n.body,
      status: dto.status ?? n.status,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : n.scheduledAt,
      metadata: dto.metadata ?? n.metadata,
      updatedAt: new Date()
    };
    notifications.set(id, updated);
    LogSync('backend', 'debug', 'repository', `notificationRepo.update — id=${id} updated`);
    return updated;
  },

  delete(id: string): boolean {
    const existed = notifications.delete(id);
    LogSync('backend', 'debug', 'repository', `notificationRepo.delete — id=${id}, existed=${existed}`);
    return existed;
  },

  markSent(id: string): Notification | undefined {
    const n = notifications.get(id);
    if (!n) return undefined;
    n.status = 'sent';
    n.sentAt = new Date();
    n.updatedAt = new Date();
    notifications.set(id, n);
    LogSync('backend', 'debug', 'repository', `notificationRepo.markSent — id=${id}`);
    return n;
  },

  markRead(id: string): Notification | undefined {
    const n = notifications.get(id);
    if (!n) return undefined;
    n.status = 'read';
    n.readAt = new Date();
    n.updatedAt = new Date();
    notifications.set(id, n);
    LogSync('backend', 'debug', 'repository', `notificationRepo.markRead — id=${id}`);
    return n;
  }
};
