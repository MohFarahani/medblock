'use client';

import { Box, Grid } from "@mui/material";
import DicomViewer from "@/components/DicomViewer/index";
import { useState, useEffect } from "react";
import { ImagePreviewList } from "@/components/ImagePreviewList";
import { useSearchParams } from 'next/navigation';
import { DicomData } from "@/graphql/types";

const MultiPreviewPage = () => {
  const searchParams = useSearchParams();
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const filesParam = searchParams.get('files');
    if (filesParam) {
      try {
        const decodedFiles = JSON.parse(decodeURIComponent(filesParam));
        setFiles(decodedFiles);
        // Set the first file as initially selected
        if (decodedFiles.length > 0) {
          setSelectedFilePath(decodedFiles[0]);
        }
      } catch (error) {
        console.error('Error parsing files parameter:', error);
      }
    }
  }, [searchParams]);

  // Convert files to DicomData format for ImagePreviewList
  const filesList: DicomData[] = files.map((filePath) => ({
    FilePath: filePath,
    PatientName: '',  // These will be populated by useDicomData in PreviewItem
    StudyDate: '',
    Modality: '',
  }));

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 64px)' }}>
      {/* Left side - Image previews */}
      <Grid item xs={3}>
        <Box sx={{ 
          height: '100%', 
          overflowY: 'auto',
          borderRight: '1px solid #e0e0e0'
        }}>
          <ImagePreviewList 
            files={filesList}
            loading={false}
            selectedFilePath={selectedFilePath}
            onSelectImage={setSelectedFilePath}
          />
        </Box>
      </Grid>

      {/* Right side - Selected image viewer */}
      <Grid item xs={9}>
        <Box sx={{ height: '100%', p: 2 }}>
          {selectedFilePath ? (
            <DicomViewer 
              filePath={selectedFilePath}
              showInfo={true}
              showControls={true}
              showModal={true}
            />
          ) : (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              height="100%"
            >
              Select an image to view details
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default MultiPreviewPage; 