import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Inbox } from '@mui/icons-material';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "No notifications found",
  description = "Check back later for updates" 
}) => {
  return (
    <Paper elevation={0} sx={{ 
      p: 6, 
      textAlign: 'center',
      bgcolor: 'transparent'
    }}>
      <Inbox sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {message}
      </Typography>
      <Typography variant="body2" color="text.disabled">
        {description}
      </Typography>
    </Paper>
  );
};