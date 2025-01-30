// src/graphql/schema.ts
import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Patient {
    idPatient: ID!
    Name: String!
    CreatedDate: String!
    studies: [Study]
  }

  type Modality {
    idModality: ID!
    Name: String!
  }

  type Study {
    idStudy: ID!
    idPatient: ID!
    StudyName: String!
    CreatedDate: String!
    patient: Patient
    series: [Series]
  }

  type Series {
    idSeries: ID!
    idPatient: ID!
    idStudy: ID!
    idModality: ID!
    SeriesName: String!
    CreatedDate: String!
    study: Study
    modality: Modality
    files: [File]
  }

  type File {
    idFile: ID!
    idPatient: ID!
    idStudy: ID!
    idSeries: ID!
    FilePath: String!
    CreatedDate: String!
    series: Series
    study: Study     
    patient: Patient 
  }

  input DicomUploadInput {
    patientName: String!
    studyDate: String!
    studyDescription: String
    seriesDescription: String
    modality: String!
    filePath: String!
  }

  type Query {
    patients: [Patient]
    patient(idPatient: ID!): Patient
    studies: [Study]
    study(idStudy: ID!): Study
    allSeries: [Series]
    series(idSeries: ID!): Series
    files: [File]
    file(idFile: ID!): File
  }

  type Mutation {
    processDicomUpload(input: DicomUploadInput!): File
  }
`;