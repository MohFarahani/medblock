import { gql } from '@apollo/client';

export const patientTypeDefs = gql`
  type Patient {
    idPatient: ID!
    Name: String!
    CreatedDate: String!
    studies: [Study]
  }
`;