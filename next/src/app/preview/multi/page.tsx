'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { DicomData } from "@/graphql/types";
import DicomPreviewLayout from "@/components/DicomPreviewLayout";

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
    <DicomPreviewLayout
      files={filesList}
      loading={false}
      selectedFilePath={selectedFilePath}
      onSelectImage={setSelectedFilePath}
    />
  );
};

export default MultiPreviewPage; 