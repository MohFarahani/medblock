'use client';

import Button from '@mui/material/Button';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DicomDataTable } from './types';
import ViewButton from '../ViewButton';
import { formatDateToMonthDayYear } from '@/utils/dates';

// Move handleDownload outside of getDefaultColumns and make it handle multiple files
const handleDownload = async (rows: DicomDataTable | DicomDataTable[]) => {
  try {
    // Convert single row to array if needed
    const filesToDownload = Array.isArray(rows) ? rows : [rows];
    
    // Download each file sequentially to avoid overwhelming the browser
    for (const row of filesToDownload) {
      const response = await fetch(`/api/download?filePath=${encodeURIComponent(row.FilePath)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to download ${row.FilePath}`);
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = row.FilePath.split('/').pop() || 'dicom-file';
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      // Add a small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download one or more files');
  }
};

export const getDefaultColumns = (selectedRows: DicomDataTable[] = []): GridColDef<DicomDataTable>[] => {
  return [
    {
      field: 'PatientName',
      headerName: 'Patient Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'StudyDate',
      headerName: 'Study Date',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        return formatDateToMonthDayYear(params.row?.StudyDate);
      },
    },
    {
      field: 'SeriesDescription',
      headerName: 'Series Description',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'Modality',
      headerName: 'Modality',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'download',
      headerName: 'Download',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<DicomDataTable>) => {
        const isRowSelected = selectedRows.some(row => row.id === params.row.id);
        const hasOtherRowsSelected = selectedRows.length > 0 && !isRowSelected;

        return (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              const rowsToDownload = selectedRows.length > 0 ? selectedRows : params.row;
              handleDownload(rowsToDownload);
            }}
            disabled={hasOtherRowsSelected}
          >
            {selectedRows.length > 0 ? `Download ${selectedRows.length} Files` : 'Download'}
          </Button>
        );
      },
    },
    {
      field: 'FilePath',
      headerName: 'View Image',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <ViewButton
          filePath={params.row.FilePath} 
          routePath="download/preview" 
        />
      ),
    },
  ];
};