import { DicomUploadResponse } from '../graphql/types';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const uploadDicomFile = async (file: File): Promise<DicomUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<DicomUploadResponse>('/process-dicom', formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error || 'Failed to upload DICOM file');
    }
    throw error;
  }
};

export default api;