import React from 'react';
import { Pagination as MuiPagination, Box, Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import { logger } from '@/logger/logger';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onLimitChange
}) => {
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number): void => {
    logger.info('Page changed', { from: currentPage, to: page }, 'Pagination');
    onPageChange(page);
  };
  
  const handleLimitChange = (event: SelectChangeEvent<number>): void => {
    const newLimit = event.target.value as number;
    logger.info('Items per page changed', { from: limit, to: newLimit }, 'Pagination');
    onLimitChange(newLimit);
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mt: 3,
      flexWrap: 'wrap',
      gap: 2
    }}>
      <FormControl size="small">
        <Select<number>
          value={limit}
          onChange={handleLimitChange}
        >
          <MenuItem value={5}>5 per page</MenuItem>
          <MenuItem value={10}>10 per page</MenuItem>
          <MenuItem value={20}>20 per page</MenuItem>
          <MenuItem value={50}>50 per page</MenuItem>
        </Select>
      </FormControl>
      
      <MuiPagination 
        count={totalPages} 
        page={currentPage} 
        onChange={handlePageChange}
        color="primary"
        size="medium"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};