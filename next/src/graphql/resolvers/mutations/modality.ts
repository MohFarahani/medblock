import { models } from '@/db/models';
import type { Transaction } from 'sequelize';

export interface CreateModalityInput {
  Name: string;
}

export const createOrFindModality = async (
  input: CreateModalityInput,
  transaction: Transaction
) => {
  const [modality] = await models.Modality.findOrCreate({
    where: { Name: input.Name },
    defaults: { Name: input.Name },
    transaction,
    lock: true
  });

  return modality;
};