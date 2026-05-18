export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10
};

export const NOTIFICATION_TYPES: readonly NotificationType[] = [
  'info',
  'success', 
  'warning',
  'error',
  'event',
  'placement',
  'result'
] as const;

import { NotificationType } from '@/types/notification';

export const PRIORITY_WEIGHTS = {
  placement: 100,
  result: 80,
  event: 60,
  default: 40
};

export const LOADING_MESSAGES: string[] = [
  'Fetching updates...',
  'Loading notifications...',
  'Almost there...'
];