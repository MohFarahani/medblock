'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { DicomData } from "@/graphql/types";
import DicomPreviewLayout from "@/components/DicomPreviewLayout";
import { Box, Button, Container } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";
import { ROUTES } from '@/constants/routes';

const MultiPreviewPage = () => {
  const searchParams = useSearchParams();
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => {
    const filesParam = searchParams.get('files');
    if (filesParam) {
      try {
        const decodedFiles = JSON.parse(decodeURIComponent(filesParam));
        setFiles(decodedFiles);
        if (decodedFiles.length > 0) {
          setSelectedFilePath(decodedFiles[0]);
        }
      } catch (error) {
        console.error('Error parsing files parameter:', error);
      }
    }
  }, [searchParams]);

  // Convert files to DicomData format
  const filesList: DicomData[] = files.map((filePath) => ({
    FilePath: filePath,
    PatientName: '',
    StudyDate: '',
    Modality: '',
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box sx={{ mb: 4 }}>
      <Button 
        variant="contained" 
        onClick={() => router.push(ROUTES.HOME.ROOT)}
        startIcon={<ArrowBackIcon />}
      >
        Back to Home
      </Button>
    </Box>
    <DicomPreviewLayout
      files={filesList}
      loading={false}
      selectedFilePath={selectedFilePath}
      onSelectImage={setSelectedFilePath}
    />
    </Container>

  );
};

export default MultiPreviewPage; 