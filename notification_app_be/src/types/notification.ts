export interface User {
  id: string;
  email: string;
  name: string;
  preferences: NotificationPrefs;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationPrefs {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  status: NotificationStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationType =
  | 'alert'
  | 'reminder'
  | 'promotion'
  | 'system'
  | 'transactional';

export type NotificationChannel = 'email' | 'push' | 'sms' | 'in_app';

export type NotificationStatus =
  | 'pending'
  | 'scheduled'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed';

export interface CreateUserDto {
  email: string;
  name: string;
  preferences?: Partial<NotificationPrefs>;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  preferences?: Partial<NotificationPrefs>;
}

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  scheduledAt?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateNotificationDto {
  title?: string;
  body?: string;
  status?: NotificationStatus;
  scheduledAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiRes<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
