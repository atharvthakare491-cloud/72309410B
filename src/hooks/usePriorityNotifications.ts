import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { priorityCalculator } from '@/utils/priorityAlgorithm';
import { PriorityNotification } from '@/types/notification';
import { logger } from '@/logger/logger';

interface UsePriorityNotificationsReturn {
  priorityNotifications: PriorityNotification[];
  loading: boolean;
  error: string | null;
  refreshPriority: () => void;
  totalAvailable: number;
}

export function usePriorityNotifications(limit: number = 10): UsePriorityNotificationsReturn {
  const { notifications, loading, error, retry } = useNotifications();
  const [priorityList, setPriorityList] = useState<PriorityNotification[]>([]);
  
  useEffect(() => {
    if (notifications.length > 0) {
      logger.info('Calculating priority notifications', { total: notifications.length, limit }, 'usePriorityNotifications');
      const prioritized = priorityCalculator.getTopPriorityNotifications(notifications, limit);
      setPriorityList(prioritized);
      logger.info('Priority calculation complete', { priorityCount: prioritized.length }, 'usePriorityNotifications');
    }
  }, [notifications, limit]);
  
  const refreshPriority = useCallback((): void => {
    logger.info('Manual priority refresh requested', undefined, 'usePriorityNotifications');
    retry();
  }, [retry]);
  
  return {
    priorityNotifications: priorityList,
    loading,
    error,
    refreshPriority,
    totalAvailable: notifications.length
  };
}