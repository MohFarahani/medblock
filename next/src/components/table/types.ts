import { DicomData } from '@/graphql/types';
import { GridColDef } from '@mui/x-data-grid';
export interface DicomDataTable extends DicomData {
  id?: number;
}

export interface TableProps {
  data: DicomDataTable[];
  loading?: boolean;
  columns?: GridColDef[];
  title?: string;
}

export interface DicomData {
  id?: string | number;
  PatientName: string;
  StudyDate: string;
  StudyDescription?: string;
  SeriesDescription?: string;
  Modality: string;
  FilePath: string;
}