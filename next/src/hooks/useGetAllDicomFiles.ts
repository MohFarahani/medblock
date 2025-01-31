// src/hooks/useGetAllDicomFiles.ts
import { useQuery } from '@apollo/client';
import { GET_ALL_DICOM_FILES } from '@/graphql/operations';
import { DicomData } from '@/graphql/types';



export const useGetAllDicomFiles = () => {
  const { data, loading, error, refetch } = useQuery<{ getAllDicomFiles: DicomData[] }>(
    GET_ALL_DICOM_FILES
  );

  return {
    data: data?.getAllDicomFiles || [],
    loading,
    error,
    refetch,
  };
};