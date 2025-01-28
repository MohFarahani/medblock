'use client';

import { Box, Typography, Paper } from '@mui/material';
import { 
  DataGrid, 
  GridToolbar,
} from '@mui/x-data-grid';
import { TableProps } from './types';
import { getDefaultColumns } from './columns';

export const Table= ({ 
  data, 
  loading = false, 
  columns = getDefaultColumns(),
  title = 'Data Table'
}: TableProps) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        {data.length === 0 && !loading ? (
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            sx={{ py: 2 }}
          >
            No data available.
          </Typography>
        ) : (
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
              sorting: {
                sortModel: [{ field: 'InstanceNumber', sort: 'asc' }],
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
              '& .MuiDataGrid-row:nth-of-type(odd)': {
                backgroundColor: 'action.hover',
              },
            }}
            density="comfortable"
            disableRowSelectionOnClick
            getRowHeight={() => 'auto'}
          />
        )}
      </Box>
    </Paper>
  );
}

export default Table;