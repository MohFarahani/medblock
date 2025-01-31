'use client';

import { Box } from '@mui/material';
import Table from '@/components/table/Table';
import { useGetAllDicomFiles } from '@/hooks/useGetAllDicomFiles';


export default function DownloadPage() {
  const { data, loading, error }
   = useGetAllDicomFiles();

  
  
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