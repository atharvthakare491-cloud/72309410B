import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { LOADING_MESSAGES } from '@/constants';

interface LoaderProps {
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ fullScreen = false }) => {
  const [messageIndex, setMessageIndex] = useState<number>(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const content = (
    <Fade in>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 3
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary" align="center">
          {LOADING_MESSAGES[messageIndex]}
        </Typography>
      </Box>
    </Fade>
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