'use client';

import { Box, Grid } from "@mui/material";
import DicomViewer from "@/components/DicomViewer/index";
import { useGetAllDicomFiles } from "@/hooks/useGetAllDicomFiles";
import { useState } from "react";
import { ImagePreviewList } from "@/components/ImagePreviewList";

const PreviewPage = () => {
  const { data, loading, error } = useGetAllDicomFiles();
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
            files={data} 
            loading={loading}
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

export default PreviewPage;