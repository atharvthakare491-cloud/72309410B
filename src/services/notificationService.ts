import { apiClient } from './api';
import { endpoints } from './endpoints';
import { Notification, ApiResponse, NotificationFilters, PostData } from '@/types/notification';
import { logger } from '@/logger/logger';
import { DEFAULT_PAGINATION } from '@/constants';

class NotificationService {
  async fetchNotifications(filters: NotificationFilters): Promise<ApiResponse<Notification[]>> {
    try {
      logger.info('Fetching notifications with filters', {
        page: filters.page,
        limit: filters.limit,
        type: filters.notification_type
      }, 'NotificationService');
      
      const posts = await apiClient.get<PostData[]>(endpoints.posts, {
        params: {
          _page: filters.page,
          _limit: filters.limit
        }
      });
      
      const notifications: Notification[] = posts.map((post, index) => ({
        id: `${post.id}`,
        title: post.title,
        message: post.body,
        type: this.determineNotificationType(index),
        timestamp: new Date(Date.now() - index * 3600000).toISOString(),
        read: Math.random() > 0.7,
        metadata: {
          importance: Math.floor(Math.random() * 10) + 1
        }
      }));
      
      const response: ApiResponse<Notification[]> = {
        success: true,
        data: notifications,
        total: 100,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(100 / filters.limit)
      };
      
      logger.info('Notifications fetched successfully', { count: notifications.length }, 'NotificationService');
      return response;
    } catch (error) {
      logger.error('Failed to fetch notifications', error, 'NotificationService');
      throw error;
    }
  }
  
  private determineNotificationType(index: number): Notification['type'] {
    const types: Notification['type'][] = ['info', 'success', 'warning', 'error', 'event', 'placement', 'result'];
    return types[index % types.length];
  }
  
  async getNotificationById(id: string): Promise<Notification | null> {
    try {
      logger.info(`Fetching notification ${id}`, undefined, 'NotificationService');
      const post = await apiClient.get<PostData>(`${endpoints.posts}/${id}`);
      
      const notification: Notification = {
        id: `${post.id}`,
        title: post.title,
        message: post.body,
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      };
      
      return notification;
    } catch (error) {
      logger.error(`Failed to fetch notification ${id}`, error, 'NotificationService');
      return null;
    }
  }
}

export const notificationService = new NotificationService();