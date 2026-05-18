import { Notification, PriorityNotification } from '@/types/notification';
import { PRIORITY_WEIGHTS } from '@/constants';

interface PriorityResult {
  score: number;
  reason: string;
}

export class PriorityCalculator {
  private static instance: PriorityCalculator;
  
  private constructor() {}
  
  static getInstance(): PriorityCalculator {
    if (!PriorityCalculator.instance) {
      PriorityCalculator.instance = new PriorityCalculator();
    }
    return PriorityCalculator.instance;
  }
  
  calculateScore(notification: Notification): PriorityResult {
    let score = 0;
    let reason = '';
    
    // Placement priority
    if (notification.type === 'placement' || notification.metadata?.placement) {
      score += PRIORITY_WEIGHTS.placement;
      reason = 'High priority placement update';
    }
    // Result priority
    else if (notification.type === 'result' || notification.metadata?.result) {
      score += PRIORITY_WEIGHTS.result;
      reason = 'Important result notification';
    }
    // Event priority
    else if (notification.type === 'event' || notification.metadata?.event) {
      score += PRIORITY_WEIGHTS.event;
      reason = 'Upcoming event reminder';
    }
    else {
      score += PRIORITY_WEIGHTS.default;
      reason = 'Standard notification';
    }
    
    // Time-based boost (newer notifications get higher priority)
    const ageInHours = (Date.now() - new Date(notification.timestamp).getTime()) / (1000 * 60 * 60);
    const timeBoost = Math.max(0, 50 - ageInHours * 2);
    score += timeBoost;
    
    // Metadata importance boost
    if (notification.metadata?.importance) {
      score += notification.metadata.importance * 10;
      reason += ' with elevated importance';
    }
    
    return { score: Math.floor(score), reason };
  }
  
  getTopPriorityNotifications(
    notifications: Notification[], 
    limit: number = 10
  ): PriorityNotification[] {
    const withScores: PriorityNotification[] = notifications.map(notification => {
      const { score, reason } = this.calculateScore(notification);
      return {
        ...notification,
        priorityScore: score,
        reason: reason
      };
    });
    
    // Sort by priority score descending
    withScores.sort((a, b) => b.priorityScore - a.priorityScore);
    
    return withScores.slice(0, limit);
  }
}

export const priorityCalculator = PriorityCalculator.getInstance();