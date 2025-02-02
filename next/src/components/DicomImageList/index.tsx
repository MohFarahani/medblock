'use client';

import { Box, ImageList, ImageListItem } from "@mui/material";
import { DicomData } from "@/graphql/types";

interface DicomImageListProps {
  dicomFiles: DicomData[];
  selectedFilePath: string;
  onSelectImage: (filePath: string) => void;
}

export const DicomImageList = ({ 
  dicomFiles, 
  selectedFilePath, 
  onSelectImage 
}: DicomImageListProps) => {
  return (
    <Box sx={{ 
      height: 'calc(100vh - 100px)', 
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#555',
      },
    }}>
      <ImageList cols={2} gap={8}>
        {dicomFiles.map((file) => (
          <ImageListItem 
            key={file.FilePath}
            onClick={() => onSelectImage(file.FilePath)}
            sx={{
              cursor: 'pointer',
              border: selectedFilePath === file.FilePath ? '2px solid #1976d2' : 'none',
              borderRadius: '4px',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <img
              src={`/api/process-dicom?filePath=${encodeURIComponent(file.FilePath)}`}
              alt={`${file.PatientName} - ${file.StudyDescription || ''}`}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}; 