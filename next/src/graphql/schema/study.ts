import { gql } from '@apollo/client';

export const studyTypeDefs = gql`
  type Study {
    idStudy: ID!
    idPatient: ID!
    StudyName: String!
    CreatedDate: String!
    patient: Patient
    series: [Series]
  }
`;