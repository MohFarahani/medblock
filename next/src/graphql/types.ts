export interface DicomDataInput {
    PatientName: string;
    StudyDescription: string;
    SeriesDescription: string;
    Modality: string;
    FilePath: string;
  }
  
  export interface DicomUploadInput {
    patientName: string;
    studyDescription: string;
    seriesDescription: string;
    modalityName: string;
    filePath: string;
  }