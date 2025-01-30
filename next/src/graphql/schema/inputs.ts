import { gql } from '@apollo/client';

export const inputTypeDefs = gql`
  input DicomUploadInput {
    patientName: String!
    studyDate: String!
    studyDescription: String
    seriesDescription: String
    modality: String!
    filePath: String!
  }
`;