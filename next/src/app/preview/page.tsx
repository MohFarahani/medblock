'use client';

import DicomViewer from "@/components/DicomViewer";
import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DicomViewerPage = () => {
  const searchParams = useSearchParams();
  const [filePath, setFilePath] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const queryFilePath = searchParams.get('filePath');
    
    if (!queryFilePath) {
      setError('No file path provided');
      return;
    }

    try {
      const decodedPath = decodeURIComponent(queryFilePath);
      console.log('Decoded path:', decodedPath);
      setFilePath(decodedPath);
    } catch  {
      setError('Invalid file path');
    }
  }, [searchParams]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {filePath && <DicomViewer filePath={filePath} />}
    </Container>
  );
};

export default DicomViewerPage;