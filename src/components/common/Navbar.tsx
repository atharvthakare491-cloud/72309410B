import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { NotificationsActive, PriorityHigh } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { logger } from '@/logger/logger';

export const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  
  const handleNavigation = (path: string): void => {
    logger.info(`Navigation to ${path}`, undefined, 'Navbar');
    router.push(path);
  };
  
  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Notification Hub
        </Typography>
        <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2 }}>
          <Button 
            color="inherit" 
            onClick={() => handleNavigation('/')}
            startIcon={<NotificationsActive />}
            sx={{ fontWeight: router.pathname === '/' ? 700 : 400 }}
          >
            {!isMobile && 'All'}
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handleNavigation('/priority')}
            startIcon={<PriorityHigh />}
            sx={{ fontWeight: router.pathname === '/priority' ? 700 : 400 }}
          >
            {!isMobile && 'Priority'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};