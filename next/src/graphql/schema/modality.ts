import { gql } from '@apollo/client';

export const modalityTypeDefs = gql`
  type Modality {
    idModality: ID!
    Name: String!
  }
`;