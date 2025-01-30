import { models } from '@/db/models';
import type { Transaction } from 'sequelize';

export interface CreateStudyInput {
  idPatient: number;
  StudyName: string;
  CreatedDate: Date;
}

export const createStudy = async (
  input: CreateStudyInput,
  transaction: Transaction
) => {
  return await models.Study.create({
    idPatient: input.idPatient,
    StudyName: input.StudyName,
    CreatedDate: input.CreatedDate,
  }, { transaction });
};