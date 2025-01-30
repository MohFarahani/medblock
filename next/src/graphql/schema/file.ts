import { gql } from '@apollo/client';

export const fileTypeDefs = gql`
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
`;