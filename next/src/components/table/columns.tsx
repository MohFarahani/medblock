'use client';

import Button from '@mui/material/Button';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DicomData } from './types';
import ViewButton from '../ViewButton';


const handleDownload = (row: DicomData) => {
  // Implement download functionality
  console.log('Downloading:', row);
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
        field: 'filePath',
        headerName: 'View Image',
        flex: 1,
        sortable: false,
        renderCell: (params) => {
          console.log('Params:', params); // Debug log
          console.log('Row data:', params.value); // Debug log
          return (
            <ViewButton
              filePath={params.row.filePath} // Try using params.value instead
              routePath="preview" 
            />
          );
        },
      },
    ];
};