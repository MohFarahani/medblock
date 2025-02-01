// src/components/DicomViewer/hooks/useDicomData.ts

import { useState, useEffect } from 'react';
import axios from 'axios';
import { DicomViewerfData } from '@/components/DicomViewer/types';

export const useDicomData = (filePath: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DicomViewerfData | null>(null);

  useEffect(() => {
    const fetchDicomData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post('/api/process-dicom', {
          filePath: filePath
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.error) {
          throw new Error(response.data.error);
        }

        setData(response.data);
      } catch (err) {
        console.error('Error fetching DICOM data:', err);
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error || 
            err.message || 
            'Failed to load DICOM image'
          );
        } else {
          setError('Failed to load DICOM image');
        }
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      fetchDicomData();
    }
  }, [filePath]);

  return { data, loading, error };
};