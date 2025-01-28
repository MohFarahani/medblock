import { GridColDef } from '@mui/x-data-grid';

export const getDefaultColumns = (): GridColDef[] => [
  { 
    field: 'Modality', 
    headerName: 'Modality', 
    width: 100,
    description: 'Type of imaging modality'
  },
  { 
    field: 'SeriesDescription', 
    headerName: 'Series Description', 
    width: 200,
    description: 'Description of the series'
  },
  { 
    field: 'PatientName', 
    headerName: 'Patient Name', 
    width: 150,
    description: 'Name of the patient'
  },

  { 
    field: 'SliceThickness', 
    headerName: 'Slice Thickness', 
    width: 130,
    type: 'number',
    description: 'Thickness of the slice in mm'
  },
  { 
    field: 'SpacingBetweenSlices', 
    headerName: 'Slice Spacing', 
    width: 120,
    type: 'number',
    description: 'Space between slices in mm'
  },
  { 
    field: 'InstanceNumber', 
    headerName: 'Instance #', 
    width: 100,
    type: 'number'
  },
  { 
    field: 'SliceLocation', 
    headerName: 'Slice Location', 
    width: 120,
    type: 'number'
  },
  { 
    field: 'SeriesNumber', 
    headerName: 'Series #', 
    width: 100,
    type: 'number'
  },
];