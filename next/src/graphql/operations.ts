import { gql } from '@apollo/client';

export const PROCESS_DICOM_UPLOAD = gql`
  mutation ProcessDicomUpload($input: DicomUploadInput!) {
    processDicomUpload(input: $input) {
      idFile
      FilePath
      CreatedDate
    }
  }
`;

export const GET_PATIENT_DATA = gql`
  query GetPatientData($idPatient: ID!) {
    patient(idPatient: $idPatient) {
      idPatient
      Name
      CreatedDate
      studies {
        idStudy
        StudyName
        StudyDate
        series {
          idSeries
          SeriesName
          modality {
            Name
          }
          files {
            FilePath
          }
        }
      }
    }
  }
`;

export const GET_ALL_DICOM_FILES = gql`
  query GetAllDicomFiles {
    getAllDicomFiles {
      PatientName
      StudyDate
      StudyDescription
      SeriesDescription
      Modality
      FilePath
    }
  }
`;

export const CHECK_FILE_PATH_EXISTS = gql`
  query CheckFilePathExists($filePath: String!) {
    checkFilePathExists(filePath: $filePath)
  }
`;