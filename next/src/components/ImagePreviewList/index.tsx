'use client';

import { Box, Skeleton } from "@mui/material";
import { DicomData } from "@/graphql/types";
import { useDicomData } from "@/hooks/useDicomData";
import Image from 'next/image';
import { PreviewItem } from './PreviewItem';

interface ImagePreviewListProps {
  files: DicomData[];
  loading: boolean;
  selectedFilePath: string;
  onSelectImage: (filePath: string) => void;
}

export const ImagePreviewList = ({ 
  files, 
  loading, 
  selectedFilePath,
  onSelectImage 
}: ImagePreviewListProps) => {
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={200} sx={{ mb: 2 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {files.map((file) => (
        <PreviewItem
          key={file.FilePath}
          file={file}
          isSelected={file.FilePath === selectedFilePath}
          onClick={() => onSelectImage(file.FilePath)}
        />
      ))}
    </Box>
  );
}; 