'use client';

import { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import Image from 'next/image';
import axios from 'axios';

interface DicomViewerProps {
  filePath: string;
}

interface DicomData {
  image: {
    data: string;
    width: number;
    height: number;
  };
  PatientName: string;
  StudyDate: string;
  StudyDescription: string;
  SeriesDescription: string;
  Modality: string;
}

const DicomViewer = ({ filePath }: DicomViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dicomData, setDicomData] = useState<DicomData | null>(null);

  useEffect(() => {
    const fetchDicomData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make sure to use the absolute path
        const response = await axios.post('/api/process-dicom', {
          filePath: filePath
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        setDicomData(response.data);
      } catch (err) {
        console.error('Error fetching DICOM data:', err);
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error || 
            err.message || 
            'Failed to load DICOM image'
          );
        } else {
          setError('Failed to load DICOM image');
        }
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      fetchDicomData();
    }
  }, [filePath]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!dicomData || !dicomData.image.data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>No image data available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h6">DICOM Information</Typography>
        <Typography>Patient Name: {dicomData.PatientName}</Typography>
        <Typography>Study Date: {dicomData.StudyDate}</Typography>
        <Typography>Study Description: {dicomData.StudyDescription}</Typography>
        <Typography>Series Description: {dicomData.SeriesDescription}</Typography>
        <Typography>Modality: {dicomData.Modality}</Typography>
      </Box>
      
      <Box position="relative" width="100%" height="auto">
        <Image
          src={`data:image/png;base64,${dicomData.image.data}`}
          alt="DICOM Image"
          width={dicomData.image.width}
          height={dicomData.image.height}
          style={{
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      </Box>
    </Box>
  );
};

export default DicomViewer;