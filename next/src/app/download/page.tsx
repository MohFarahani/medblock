'use client';

import { Box } from '@mui/material';
import Table from '@/components/table/Table';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_DICOM_DATA = gql`
  query GetDicomData {
    dicomData {
      id
      PatientName
      StudyDate
      StudyDescription
      SeriesDescription
      Modality
      filepath
    }
  }
`;

export default function DownloadPage() {
  const { loading, error, data } = useQuery(GET_DICOM_DATA);
  
  if (error) return <div>Error loading data</div>;
  
  return (
    <Box sx={{ height: 600 }}>
      <Table 
        data={data || []} 
        loading={loading}
        title="Available DICOM Data"
      />
    </Box>
  );
}