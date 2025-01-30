import { gql } from '@apollo/client';
import { patientTypeDefs } from './patient';
import { studyTypeDefs } from './study';
import { seriesTypeDefs } from './series';
import { fileTypeDefs } from './file';
import { modalityTypeDefs } from './modality';
import { inputTypeDefs } from './inputs';
import { queryTypeDefs } from './queries';
import { mutationTypeDefs } from './mutations';

export const typeDefs = gql`
  ${patientTypeDefs}
  ${studyTypeDefs}
  ${seriesTypeDefs}
  ${fileTypeDefs}
  ${modalityTypeDefs}
  ${inputTypeDefs}
  ${queryTypeDefs}
  ${mutationTypeDefs}
`;