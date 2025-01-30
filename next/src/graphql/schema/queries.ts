import { gql } from '@apollo/client';

export const queryTypeDefs = gql`
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
`;