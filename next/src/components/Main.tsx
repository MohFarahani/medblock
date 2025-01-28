// Main.tsx
'use client';

import { Container, Box, Typography, Stack, Alert, Snackbar } from '@mui/material';
import { Upload } from '@/components/Upload';
import { useState, useEffect } from 'react';
import Table from './table/Table';
import { DicomData } from './table/types';

const Main = () => {
  const [dicomData, setDicomData] = useState<DicomData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileSelect = async (files: File[]) => {
    setLoading(true);
    setError(null);
    
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
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error);
          }
  
          return {
            id: mounted ? crypto.randomUUID() : Math.random().toString(),
            ...data
          };
        })
      );
  
      setDicomData(results);
    } catch (error) {
      console.error('Error processing DICOM files:', error);
      setError(error instanceof Error ? error.message : 'Failed to process DICOM files');
      setDicomData([]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null; // Return null on server-side
  }

  return (
    <Container maxWidth="lg">
      <Stack spacing={4} my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          DICOM File Upload
        </Typography>
        
        <Upload onFileSelect={handleFileSelect} />
        
        <Box sx={{ height: 600 }}>
          <Table 
            data={dicomData} 
            loading={loading}
            title="DICOM Data"
          />
        </Box>

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
};

export default Main;