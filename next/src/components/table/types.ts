import { GridColDef } from '@mui/x-data-grid';

export interface DicomData {
  id: number;
  Modality: string;
  SeriesDescription: string;
  ProtocolName: string;
  PatientName: string;
  StudyDate: string;
  StudyTime: string;
  SliceThickness: number;
  SpacingBetweenSlices: number;
  RepetitionTime: number;
  EchoTime: number;
  MagneticFieldStrength: number;
  SeriesNumber: number;
  StudyDescription: string;
  InstanceNumber: number;
  SliceLocation: number;
}

export interface TableProps {
  data: DicomData[];
  loading?: boolean;
  columns?: GridColDef[];
  title?: string;
}