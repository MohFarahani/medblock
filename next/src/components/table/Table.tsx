'use client';

import { Box, Typography, Paper } from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { getDefaultColumns } from './columns';
import { useState } from 'react';
import { DownloadProvider } from '@/providers/DownloadProvider';
import { DicomData } from '@/graphql/types';
import { DicomDataTable } from './types';

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

export interface TableProps {
  data: DicomDataTable[];
  loading?: boolean;
  columns?: GridColDef[];
  title?: string;
  onSelectionChange?: (selectedRows: DicomDataTable[]) => void;
}

export const Table = ({ 
  data = [],
  loading = false, 
  columns,
  title = 'Data Table',
  onSelectionChange
}: TableProps) => {
  const [selectionModel, setSelectionModel] = useState<any[]>([]);
  
  const safeData = Array.isArray(data) ? data.map((item, index) => ({
    ...item,
    id: `${item.FilePath}-${index}`
  })) : [];

  const handleSelectionChange = (newSelectionModel: any) => {
    setSelectionModel(newSelectionModel);
    const selectedRows = safeData.filter(row => newSelectionModel.includes(row.id));
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  };

  const selectedRows = safeData.filter(row => selectionModel.includes(row.id));
  const effectiveColumns = columns || getDefaultColumns(selectedRows);

  return (
    <DownloadProvider>
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
              checkboxSelection
              disableRowSelectionOnClick={true}
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={handleSelectionChange}
            />
          )}
        </Box>
      </Paper>
    </DownloadProvider>
  );
};

export default Table;

