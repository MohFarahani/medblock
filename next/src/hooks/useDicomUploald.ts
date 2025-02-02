import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CHECK_FILE_PATH_EXISTS, PROCESS_DICOM_UPLOAD } from '@/graphql/operations';
import { DicomDataTable } from '@/components/Table/types';
import { ROUTES } from '@/constants/routes';
import axios from 'axios';
import { useApolloClient } from '@apollo/client';
import { LogService } from '@/utils/logging';

interface ProcessDicomResponse {
  error?: string;
  PatientName: string;
  StudyDate: string;
  StudyDescription?: string;
  SeriesDescription?: string;
  Modality: string;
  filePath: string;
}

interface FileStatus {
  file: File;
  exists: boolean;
}

export const useDicomUpload = () => {
  const [dicomData, setDicomData] = useState<DicomDataTable[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  
  const [processDicomUpload] = useMutation(PROCESS_DICOM_UPLOAD);
  const client = useApolloClient();

  const handleFileUpload = async (files: File[]) => {
    setLoading(true);
    setError(null);
    const statuses: FileStatus[] = [];
    
    try {
      const newData: DicomDataTable[] = [];
  
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
  
        const { data: dicomData } = await axios.post<ProcessDicomResponse>(
          ROUTES.API.PROCESS_DICOM,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        if (dicomData.error) {
          throw new Error(dicomData.error);
        }
  
        // Check if file exists
        const { data: existingFile } = await client.query({
          query: CHECK_FILE_PATH_EXISTS,
          variables: { filePath: dicomData.filePath }
        });
  
        if (existingFile?.checkFilePathExists) {
          LogService.warn('File already exists, skipping upload', { filePath: dicomData.filePath });
          statuses.push({ file, exists: true });
          continue;
        }
  
        statuses.push({ file, exists: false });
  
        // Only process and add non-existing files
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
  
        if (graphQLData?.processDicomUpload) {
          newData.push({
            id: Date.now() + Math.random().toString(),
            PatientName: dicomData.PatientName,
            StudyDate: dicomData.StudyDate,
            StudyDescription: dicomData.StudyDescription || 'N/A',
            SeriesDescription: dicomData.SeriesDescription || 'N/A',
            Modality: dicomData.Modality,
            FilePath: graphQLData.processDicomUpload.FilePath,
          });
        }
      }
  
      setFileStatuses(statuses);
      // Only add new, non-existing files to the table
      setDicomData(prevData => [...prevData, ...newData]);
  
    } catch (error) {
      console.error('Error processing files:', error);
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to process files'
      );
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
    fileStatuses,
  };
};