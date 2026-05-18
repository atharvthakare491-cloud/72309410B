import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Collapse } from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess,
  Info,
  CheckCircle,
  Warning,
  Error,
  Event,
  Assignment,
  TrendingUp
} from '@mui/icons-material';
import { Notification, PriorityNotification } from '@/types/notification';
import { logger } from '@/logger/logger';

interface NotificationCardProps {
  notification: Notification | PriorityNotification;
  isPriority?: boolean;
}

type IconComponent = React.ReactElement;

export const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  isPriority = false 
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  
  const getIcon = (): IconComponent => {
    switch(notification.type) {
      case 'info': return <Info color="info" />;
      case 'success': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      case 'event': return <Event color="primary" />;
      case 'placement': return <Assignment color="secondary" />;
      case 'result': return <TrendingUp color="action" />;
      default: return <Info />;
    }
  };
  
  const getTypeColor = (): 'info' | 'success' | 'warning' | 'error' | 'default' => {
    switch(notification.type) {
      case 'info': return 'info';
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };
  
  const handleExpand = (): void => {
    setExpanded(!expanded);
    logger.debug(`Card ${expanded ? 'collapsed' : 'expanded'}`, { id: notification.id }, 'NotificationCard');
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };
  
  const priorityScore = 'priorityScore' in notification ? notification.priorityScore : undefined;
  
  return (
    <Card 
      elevation={isPriority ? 3 : 1}
      sx={{ 
        mb: 2,
        borderLeft: isPriority ? 4 : 0,
        borderColor: 'primary.main',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ mt: 0.5 }}>{getIcon()}</Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {notification.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip 
                  label={notification.type} 
                  size="small" 
                  color={getTypeColor()}
                  variant="outlined"
                />
                <IconButton size="small" onClick={handleExpand}>
                  {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {notification.message}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.disabled">
                {formatDate(notification.timestamp)}
              </Typography>
              {isPriority && priorityScore !== undefined && (
                <Chip 
                  label={`Priority: ${priorityScore}`}
                  size="small"
                  color="primary"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Box>
        </Box>
        
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" component="div">
              <strong>ID:</strong> {notification.id}
            </Typography>
            {notification.metadata && (
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
                <strong>Metadata:</strong> {JSON.stringify(notification.metadata)}
              </Typography>
            )}
            {'reason' in notification && notification.reason && (
              <Typography variant="caption" color="primary" component="div" sx={{ mt: 1 }}>
                <strong>Priority Reason:</strong> {notification.reason}
              </Typography>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};