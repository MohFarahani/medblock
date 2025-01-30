'use client';

import Button from '@mui/material/Button';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
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
        field: 'PatientName',
        headerName: 'Patient Name',
        flex: 1,
      },
      {
        field: 'StudyDate',
        headerName: 'Study Date',
        flex: 1,
      },
      {
        field: 'SeriesDescription',
        headerName: 'Series Description',
        flex: 1,
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