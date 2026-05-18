import React from 'react';
import { Paper, Select, MenuItem, FormControl, InputLabel, Box, Button, Typography } from '@mui/material';
import { Clear, FilterList } from '@mui/icons-material';
import { NotificationType, NotificationFilters } from '@/types/notification';
import { NOTIFICATION_TYPES } from '@/constants';
import { logger } from '@/logger/logger';

interface FilterBarProps {
  currentFilters: NotificationFilters;
  onFilterChange: (filters: Partial<NotificationFilters>) => void;
  totalItems?: number;
}

type SelectValue = string | number | readonly string[] | undefined;

export const FilterBar: React.FC<FilterBarProps> = ({ 
  currentFilters, 
  onFilterChange,
  totalItems 
}) => {
  const handleTypeChange = (value: SelectValue): void => {
    const selectedType = value as string;
    const newType = selectedType === 'all' ? undefined : selectedType as NotificationType;
    logger.info('Filter type changed', { type: newType }, 'FilterBar');
    onFilterChange({ 
      notification_type: newType,
      page: 1 
    });
  };
  
  const handleClearFilters = (): void => {
    logger.info('Filters cleared', undefined, 'FilterBar');
    onFilterChange({ 
      notification_type: undefined,
      page: 1
    });
  };
  
  return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Notification Type</InputLabel>
          <Select
            value={currentFilters.notification_type || 'all'}
            label="Notification Type"
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            {NOTIFICATION_TYPES.map(type => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {currentFilters.notification_type && (
          <Button 
            size="small" 
            startIcon={<Clear />}
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        )}
        
        {totalItems !== undefined && (
          <Box sx={{ ml: 'auto' }}>
            <FilterList fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle', color: 'text.secondary' }} />
            <Typography variant="body2" component="span" color="text.secondary">
              {totalItems} items
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};