'use client';

import { Box, Typography, Paper } from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbar,
} from '@mui/x-data-grid';
import { getDefaultColumns } from './columns';
import { DicomData } from './types';
import { useState } from 'react';

export interface TableProps {
  data: DicomData[];
  loading?: boolean;
  columns?: GridColDef[];
  title?: string;
  onSelectionChange?: (selectedRows: DicomData[]) => void;
}

export const Table = ({ 
  data = [],
  loading = false, 
  columns,
  title = 'Data Table',
  onSelectionChange
}: TableProps) => {
  const [selectionModel, setSelectionModel] = useState<any[]>([]);
  
  // Ensure data is an array and all items have a unique id
  const safeData = Array.isArray(data) ? data.map((item, index) => ({
    ...item,
    id: `${item.FilePath}-${index}` // Combine FilePath with index for uniqueness
  })) : [];

  const handleSelectionChange = (newSelectionModel: any) => {
    setSelectionModel(newSelectionModel);
    const selectedRows = safeData.filter(row => newSelectionModel.includes(row.id));
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  };

  // Use selectedRows when getting columns
  const selectedRows = safeData.filter(row => selectionModel.includes(row.id));
  const effectiveColumns = columns || getDefaultColumns(selectedRows);

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
        {safeData.length === 0 && !loading ? (
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
            rows={safeData}
            columns={effectiveColumns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
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
            getRowHeight={() => 'auto'}
            checkboxSelection
            disableRowSelectionOnClick={true}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={handleSelectionChange}
          />
        )}
      </Box>
    </Paper>
  );
};

export default Table;

