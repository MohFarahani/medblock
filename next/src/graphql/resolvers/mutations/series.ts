import { models } from '@/db/models';
import type { Transaction } from 'sequelize';

export interface CreateSeriesInput {
  idPatient: number;
  idStudy: number;
  idModality: number;
  SeriesName: string;
  CreatedDate: Date;
}

export const createSeries = async (
  input: CreateSeriesInput,
  transaction: Transaction
) => {
  return await models.Series.create({
    idPatient: input.idPatient,
    idStudy: input.idStudy,
    idModality: input.idModality,
    SeriesName: input.SeriesName,
    CreatedDate: input.CreatedDate,
  }, { transaction });
};