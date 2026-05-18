import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';
import { Notification, NotificationFilters } from '@/types/notification';
import { logger } from '@/logger/logger';
import { DEFAULT_PAGINATION } from '@/constants';

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  filters: NotificationFilters;
  updateFilters: (newFilters: Partial<NotificationFilters>) => void;
  retry: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<NotificationFilters>({
    page: DEFAULT_PAGINATION.page,
    limit: DEFAULT_PAGINATION.limit
  });
  
  const fetchNotifications = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      logger.info('Fetching notifications', { page: filters.page, limit: filters.limit }, 'useNotifications');
      
      const response = await notificationService.fetchNotifications(filters);
      setNotifications(response.data);
      setTotalPages(response.totalPages);
      
      logger.info('Notifications loaded successfully', { count: response.data.length }, 'useNotifications');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load notifications';
      setError(errorMessage);
      logger.error('Notification fetch error', err, 'useNotifications');
    } finally {
      setLoading(false);
    }
  }, [filters]);
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  const updateFilters = useCallback((newFilters: Partial<NotificationFilters>): void => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
    logger.info('Filters updated', newFilters, 'useNotifications');
  }, []);
  
  const retry = useCallback((): void => {
    logger.info('Retrying notification fetch', undefined, 'useNotifications');
    fetchNotifications();
  }, [fetchNotifications]);
  
  return {
    notifications,
    loading,
    error,
    totalPages,
    filters,
    updateFilters,
    retry
  };
}