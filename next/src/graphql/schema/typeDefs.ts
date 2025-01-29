import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Patient {
    idPatient: ID!
    Name: String!
    CreatedDate: String!
    studies: [Study!]
  }

  type Study {
    idStudy: ID!
    idPatient: ID!
    StudyName: String!
    CreatedDate: String!
    series: [Series!]
  }

  type Modality {
    idModality: ID!
    Name: String!
    series: [Series!]
  }

  type Series {
    idSeries: ID!
    idPatient: ID!
    idStudy: ID!
    idModality: ID!
    SeriesName: String!
    CreatedDate: String!
    files: [File!]
  }

  type File {
    idFile: ID!
    idPatient: ID!
    idStudy: ID!
    idSeries: ID!
    FilePath: String!
    CreatedDate: String!
  }

  type DicomUploadResponse {
    success: Boolean!
    message: String
    patientId: ID
    studyId: ID
    seriesId: ID
    fileId: ID
  }

  input DicomDataInput {
    PatientName: String!
    StudyDescription: String!
    SeriesDescription: String!
    Modality: String!
    FilePath: String!
  }

  type Query {
    patients: [Patient!]!
    patient(id: ID!): Patient
    studies(patientId: ID!): [Study!]!
    series(studyId: ID!): [Series!]!
    files(seriesId: ID!): [File!]!
  }

  type Mutation {
    uploadDicomData(input: DicomDataInput!): DicomUploadResponse!
  }
`;