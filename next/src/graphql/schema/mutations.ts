import { gql } from '@apollo/client';

export const mutationTypeDefs = gql`
  type Mutation {
    processDicomUpload(input: DicomUploadInput!): File
  }
`;