import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { PROCESS_DICOM_UPLOAD } from '@/graphql/operations';
import { DicomDataTable } from '@/components/table/types';
import { ROUTES } from '@/constants/routes';



interface ProcessDicomResponse {
  error?: string;
  PatientName: string;
  StudyDate: string;
  StudyDescription?: string;
  SeriesDescription?: string;
  Modality: string;
  filePath: string;
}

export const useDicomUpload = () => {
  const [dicomData, setDicomData] = useState<DicomDataTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [processDicomUpload] = useMutation(PROCESS_DICOM_UPLOAD);

  const handleFileUpload = async (files: File[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const newData: DicomDataTable[] = [];
  
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
  
        // Process DICOM file
        const response = await fetch(ROUTES.API.PROCESS_DICOM, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const dicomData: ProcessDicomResponse = await response.json();
        
        if (dicomData.error) {
          throw new Error(dicomData.error);
        }
  
        // Process with GraphQL
        const { data: graphQLData } = await processDicomUpload({
          variables: {
            input: {
              patientName: dicomData.PatientName,
              studyDate: dicomData.StudyDate || new Date().toISOString(),
              studyDescription: dicomData.StudyDescription || '',
              seriesDescription: dicomData.SeriesDescription || '',
              modality: dicomData.Modality,
              filePath: dicomData.filePath,
            },
          },
        });
  
        if (!graphQLData?.processDicomUpload) {
          throw new Error('Failed to store DICOM data in database');
        }
  
        newData.push({
          id: Date.now() + Math.random(),
          PatientName: dicomData.PatientName,
          StudyDate: dicomData.StudyDate,
          StudyDescription: dicomData.StudyDescription || 'N/A',
          SeriesDescription: dicomData.SeriesDescription || 'N/A',
          Modality: dicomData.Modality,
          FilePath: graphQLData.processDicomUpload.FilePath,
        });
      }
  
      setDicomData(prevData => [...prevData, ...newData]);
  
    } catch (error) {
      console.error('Error processing files:', error);
      setError(error instanceof Error ? error.message : 'Failed to process files');
    } finally {
      setLoading(false);
    }
  };

  return {
    dicomData,
    loading,
    error,
    handleFileUpload,
    clearError: () => setError(null),
  };
};