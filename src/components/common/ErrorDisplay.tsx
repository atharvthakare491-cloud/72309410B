import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';
import { logger } from '@/logger/logger';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  onRetry, 
  fullScreen = false 
}) => {
  const handleRetry = (): void => {
    logger.info('User initiated retry', { errorMessage: message }, 'ErrorDisplay');
    onRetry?.();
  };
  
  const content = (
    <Paper elevation={0} sx={{ 
      p: 4, 
      textAlign: 'center',
      bgcolor: 'transparent'
    }}>
      <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom color="error">
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button 
          variant="contained" 
          startIcon={<Refresh />}
          onClick={handleRetry}
        >
          Try Again
        </Button>
      )}
    </Paper>
  );
  
  if (fullScreen) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {content}
      </Box>
    );
  }
  
  return content;
};