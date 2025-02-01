'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import { useDicomData } from '@/hooks/useDicomData';
import { DicomInfo } from './DicomInfo';
import { ImageViewer } from './ImageViewer';

interface DicomViewerProps {
  filePath: string;
  showControls?: boolean;
  showInfo?: boolean;
}

const DicomViewer = ({ 
  filePath, 
  showControls = true, 
  showInfo = true 
}: DicomViewerProps) => {
  const { data: dicomData, loading, error } = useDicomData(filePath);

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

  if (!dicomData || !dicomData.image?.data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>No image data available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {showInfo && <DicomInfo dicomData={dicomData} />}
      <ImageViewer dicomData={dicomData} showControls={showControls} />
    </Box>
  );
};

export default DicomViewer;