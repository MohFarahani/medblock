// src/components/Main.tsx
'use client';

import { Container, Box, Typography, Stack, Alert, Snackbar } from '@mui/material';
import { Upload } from '@/components/Upload';
import { useState, useEffect } from 'react';
import Table from './table/Table';
import { DicomData } from './table/types';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const PROCESS_DICOM_UPLOAD = gql`
  mutation ProcessDicomUpload($input: DicomUploadInput!) {
    processDicomUpload(input: $input) {
      idFile
      idPatient
      FilePath
    }
  }
`;

interface ProcessDicomResponse {
  error?: string;
  PatientName: string;
  StudyDate: string;
  StudyDescription?: string;
  SeriesDescription?: string;
  Modality: string;
  filePath: string;
}

const Main = () => {
  const [dicomData, setDicomData] = useState<DicomData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [processDicomUpload] = useMutation(PROCESS_DICOM_UPLOAD);

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleFileSelect = async (files: File[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const newData: DicomData[] = [];
  
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
  
        // Process DICOM file
        const response = await fetch('/api/process-dicom', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const dicomData: ProcessDicomResponse = await response.json();

        
        if (dicomData.error) {
          throw new Error(dicomData.error);
        }
  
        // Process with GraphQL
        const { data: graphQLData } = await processDicomUpload({
          variables: {
            input: {
              patientName: dicomData.PatientName,
              studyDate: dicomData.StudyDate || new Date().toISOString(),
              studyDescription: dicomData.StudyDescription || '',
              seriesDescription: dicomData.SeriesDescription || '',
              modality: dicomData.Modality,
              filePath: dicomData.filePath,
            },
          },
        });

        console.log('graphQLData:', graphQLData);

  
        // Verify GraphQL mutation was successful
        if (!graphQLData?.processDicomUpload) {
          throw new Error('Failed to store DICOM data in database');
        }
  
        // Add to new data array, combining DICOM and GraphQL data
        newData.push({
          id: Date.now() + Math.random(),
          PatientName: dicomData.PatientName,
          StudyDate: dicomData.StudyDate,
          StudyDescription: dicomData.StudyDescription || 'N/A',
          SeriesDescription: dicomData.SeriesDescription || 'N/A',
          Modality: dicomData.Modality,
          filePath: graphQLData.processDicomUpload.FilePath, // Use FilePath from GraphQL response
        });
      }
  
      // Update state with new data
      setDicomData(prevData => [...prevData, ...newData]);
  
    } catch (error) {
      console.error('Error processing files:', error);
      setError(error instanceof Error ? error.message : 'Failed to process files');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
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