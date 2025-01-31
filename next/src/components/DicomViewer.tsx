'use client';

import {Typography } from '@mui/material';

interface DicomViewerProps {
  filePath: string;
}

const DicomViewer = ({ filePath }: DicomViewerProps) => {

  return (
   <Typography>
   {filePath}
   </Typography>
  );
};

export default DicomViewer;