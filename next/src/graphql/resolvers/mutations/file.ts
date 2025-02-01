import { File } from '@/db/models';
import type { Transaction } from 'sequelize';

export interface CreateFileInput {
  idPatient: number;
  idStudy: number;
  idSeries: number;
  FilePath: string;
  CreatedDate: Date;
}

export const createFile = async (
  input: CreateFileInput,
  transaction: Transaction
) => {
  return await File.create({
    idPatient: input.idPatient,
    idStudy: input.idStudy,
    idSeries: input.idSeries,
    FilePath: input.FilePath,
    CreatedDate: input.CreatedDate,
  }, { transaction });
};