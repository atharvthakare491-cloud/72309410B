export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'event' | 'placement' | 'result';

export interface NotificationMetadata {
  placement?: string;
  result?: string;
  event?: string;
  importance?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  priorityScore?: number;
  metadata?: NotificationMetadata;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationFilters {
  page: number;
  limit: number;
  notification_type?: NotificationType;
}

export interface PriorityNotification extends Notification {
  priorityScore: number;
  reason: string;
}

export interface PostData {
  id: number;
  title: string;
  body: string;
  userId?: number;
}