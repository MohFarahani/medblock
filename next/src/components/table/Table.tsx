'use client';

import { Box, Typography, Paper } from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridRowSelectionModel,
} from '@mui/x-data-grid';
import { useState } from 'react';

// Custom toolbar component
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export interface GenericTableProps<T> {
  data: T[];
  columns: GridColDef[];
  loading?: boolean;
  title?: string;
  onSelectionChange?: (selectedRows: T[]) => void;
  idField?: keyof T | ((item: T) => string);
  enableSelection?: boolean;
}

export const Table = <T extends object>({ 
  data = [],
  columns,
  loading = false, 
  title = 'Data Table',
  onSelectionChange,
  idField = 'id' as keyof T,
  enableSelection = false,
}: GenericTableProps<T>) => {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  
  const safeData = Array.isArray(data) ? data.map((item, index) => ({
    ...item,
    id: typeof idField === 'function' ? idField(item) : item[idField] || `row-${index}`
  })) : [];

  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    setSelectionModel(newSelectionModel);
    const selectedRows = safeData.filter(row => newSelectionModel.includes(row.id));
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  };

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
            columns={columns}
            loading={loading}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            slots={{
              toolbar: CustomToolbar,
            }}
            sx={{
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                minHeight: '100% !important',
                maxHeight: 'none !important',
                whiteSpace: 'normal',
                lineHeight: '1.2em',
                padding: '8px',
              },
              '& .MuiDataGrid-row': {
                minHeight: '52px !important',
                maxHeight: 'none !important',
              },
              '& .MuiDataGrid-columnHeader': {
                minHeight: '52px !important',
                maxHeight: 'none !important',
                alignItems: 'center',
              },
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
              '& .MuiDataGrid-row:nth-of-type(odd)': {
                backgroundColor: 'action.hover',
              },
            }}
            getRowHeight={() => 'auto'}
            checkboxSelection={enableSelection}
            disableRowSelectionOnClick={enableSelection}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={handleSelectionChange}
          />
        )}
      </Box>
    </Paper>
  );
};

export default Table;

