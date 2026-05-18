import React from 'react';
import { Container as MuiContainer } from '@mui/material';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = 'lg' 
}) => {
  return (
    <MuiContainer maxWidth={maxWidth} sx={{ py: 3 }}>
      {children}
    </Mui