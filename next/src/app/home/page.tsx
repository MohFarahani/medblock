'use client';

import { Box } from '@mui/material';
import DicomTable from '@/components/DicomTable/DicomTable';
import { useGetAllDicomFiles } from '@/hooks/useGetAllDicomFiles';


const HomePage = () => {
  const { data, loading, error }
   = useGetAllDicomFiles();

  
  
  if (error) return <div>Error loading data</div>;
  
  return (
    <Box sx={{ height: 600 }}>
      <DicomTable 
        data={data || []} 
        loading={loading}
        title="Available DICOM Data"
      />
    </Box>
  );
}

export default HomePage;