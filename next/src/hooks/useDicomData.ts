// src/components/DicomViewer/hooks/useDicomData.ts

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DicomViewerfData } from '@/components/DicomViewer/types';
import { ROUTES } from '@/constants/routes';
import { AppError } from '@/utils/errorHandling';
import { SqlError } from '@/types/errors';
import { isDeadlockError } from '@/utils/errors';

export const useDicomData = (filePath: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DicomViewerfData | null>(null);

  const fetchDicomData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(ROUTES.API.PROCESS_DICOM, {
        filePath: filePath
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.error) {
        throw new AppError(response.data.error, response.data.code, response.status);
      }

      setData(response.data);
    } catch (err) {
      console.error('Error fetching DICOM data:', err);
      
      if (err instanceof AppError) {
        setError(err.message);
      } else if (isDeadlockError(err as SqlError)) {
        setError('Database is temporarily busy. Please try again.');
      } else if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message || 'Failed to load DICOM image');
      } else {
        setError('Failed to load DICOM image');
      }
    } finally {
      setLoading(false);
    }
  }, [filePath]);

  useEffect(() => {
    if (filePath) {
      fetchDicomData();
    }
  }, [filePath, fetchDicomData]);

  return { data, loading, error, refetch: fetchDicomData };
};