'use client';

import Button from '@mui/material/Button';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { DicomData } from './types';

const handleDownload = (row: DicomData) => {
  // Implement download functionality
  console.log('Downloading:', row);
};

const handleViewImage = (row: DicomData) => {
  // Implement view image functionality
  console.log('Viewing image:', row);
};

export const getDefaultColumns = (): GridColDef<DicomData>[] => {
    return [
      {
        field: 'imageInfo.PatientName',
        headerName: 'Patient Name',
        flex: 1,
        valueGetter: (params: GridRenderCellParams<DicomData>) => {
          return params.row?.imageInfo?.PatientName || 'N/A';
        },
      },
      {
        field: 'imageInfo.StudyDate',
        headerName: 'Patient Birth Date',
        flex: 1,
        valueGetter: (params: GridRenderCellParams<DicomData>) => {
          const date = params.row?.imageInfo?.StudyDate;
          if (!date) return 'N/A';
          try {
            const year = date.substring(0, 4);
            const month = date.substring(4, 6);
            const day = date.substring(6, 8);
            return format(new Date(Number(year), Number(month) - 1, Number(day)), 'dd/MM/yyyy');
          } catch {
            return 'Invalid Date';
          }
        },
      },
      {
        field: 'imageInfo.SeriesDescription',
        headerName: 'Series Description',
        flex: 1,
        valueGetter: (params: GridRenderCellParams<DicomData>) => {
          return params.row?.imageInfo?.SeriesDescription || 'N/A';
        },
      },
      {
        field: 'download',
        headerName: 'Download',
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<DicomData>) => (
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
        field: 'view',
        headerName: 'View Image',
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<DicomData>) => (
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => params.row && handleViewImage(params.row)}
          >
            View
          </Button>
        ),
      },
    ];
};