
'use client';

import { Container, Box, Typography, Stack } from '@mui/material';
import { Upload } from '@/components/Upload';
import { useState } from 'react';
import { DicomData } from './table/types';
import Table from './table/Table';

const Main = () => {
    const [dicomData, setDicomData] = useState<DicomData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    setLoading(true);
    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/process-dicom', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to process DICOM file');
          }

          return await response.json();
        })
      );

      setDicomData(results.map((result, index) => ({
        id: index,
        ...result
      })));
    } catch (error) {
      console.error('Error processing DICOM files:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Stack my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          File Upload
        </Typography>
        
        <Upload 
          onFileSelect={handleFileSelect}
        />
        <Box sx={{ mt: 4, height: 600 }}>
          <Table 
            data={dicomData} 
            loading={loading}
            title="DICOM Data"
          />
        </Box>
      </Stack>
    </Container>
  );
}

export default Main;