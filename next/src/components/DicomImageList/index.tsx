'use client';

import { Box, ImageList, ImageListItem } from "@mui/material";
import { DicomData } from "@/graphql/types";
import { SCROLLBAR, SPACING } from '@/constants/ui';
import Image from 'next/image';
import { ROUTES } from "@/constants/routes";

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
        width: SCROLLBAR.WIDTH,
      },
      '&::-webkit-scrollbar-track': {
        background: SCROLLBAR.TRACK_COLOR,
      },
      '&::-webkit-scrollbar-thumb': {
        background: SCROLLBAR.THUMB_COLOR,
        borderRadius: SCROLLBAR.BORDER_RADIUS,
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: SCROLLBAR.THUMB_HOVER_COLOR,
      },
    }}>
      <ImageList cols={2} gap={SPACING.LIST_GAP}>
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
            <Image
              src={`${ROUTES.API.PROCESS_DICOM}?filePath=${encodeURIComponent(file.FilePath)}`}
              alt={`${file.PatientName} - ${file.StudyDescription || ''}`}
              width={300}
              height={300}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              priority={false}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}; 