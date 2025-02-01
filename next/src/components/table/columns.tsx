'use client';

import Button from '@mui/material/Button';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DicomDataTable } from './types';
import ViewButton from '../ViewButton';
import { formatDateToMonthDayYear } from '@/utils/dates';


const handleDownload = async (row: DicomDataTable) => {
  try {
    const response = await fetch(`/api/download?filePath=${encodeURIComponent(row.FilePath)}`);
    
    if (!response.ok) {
      throw new Error('Download failed');
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
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download file');
  }
};



export const getDefaultColumns = (): GridColDef<DicomDataTable>[] => {
  

    return [
      {
        field: 'PatientName',
        headerName: 'Patient Name',
        flex: 1,
      },
      {
        field: 'StudyDate',
        headerName: 'Study Date',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          return formatDateToMonthDayYear(params.row?.StudyDate);
        },
      },
      {
        field: 'SeriesDescription',
        headerName: 'Series Description',
        flex: 1,
      },
      {
        field: 'Modality',
        headerName: 'Modality',
        flex: 1,
      },
      {
        field: 'download',
        headerName: 'Download',
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<DicomDataTable>) => (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => params.row && handleDownload(params.row)}
            >
            Download
          </Button>
        ),
      },
      {
        field: 'FilePath',
        headerName: 'View Image',
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          console.log('Params row:', params.row); // Debug log
          console.log('Params value:', params.value); // Debug log
          return (
            <ViewButton
              filePath={params.row.FilePath} 
              routePath="download/preview" 
            />
          );
        },
      },
    ];
};