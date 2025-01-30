import { GridColDef } from '@mui/x-data-grid';
export interface DicomData {
  id?: number;
  PatientName: string;
  StudyDate: string;
  StudyDescription?: string;
  SeriesDescription?: string;
  Modality: string;
  filepath: string;
  // id: number;
  // slices: {
  //   image: number[][];
  //   InstanceNumber: number;
  //   SliceLocation: number;
  //   ImageOrientationPatient: number[];
  //   ImagePositionPatient: number[];
  //   filepath: string;
  // }[];
  // width: number;
  // height: number;
  // minimum: number;
  // maximum: number;
  // Modality: string;
  // SeriesDescription: string;
  // ProtocolName: string;
  // PatientName: string;
  // StudyDate: string;
  // StudyTime: string;
  // SliceThickness: number;
  // SpacingBetweenSlices: number;
  // PixelSpacing: number[];
  // RepetitionTime: number;
  // EchoTime: number;
  // ImageType: string[];
  // MagneticFieldStrength: number;
  // SeriesNumber: number;
  // NumberOfFrames: number;
  // StudyDescription: string;
}

export interface TableProps {
  data: DicomData[];
  loading?: boolean;
  columns?: GridColDef[];
  title?: string;
}