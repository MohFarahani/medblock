import { Patient } from '@/db/models';
import type { Transaction } from 'sequelize';

export interface CreatePatientInput {
  Name: string;
  CreatedDate: Date;
}

export const createOrFindPatient = async (
  input: CreatePatientInput,
  transaction: Transaction
) => {
  const [patient] = await Patient.findOrCreate({
    where: { Name: input.Name },
    defaults: { 
      Name: input.Name,
      CreatedDate: input.CreatedDate 
    },
    transaction,
    lock: true
  });

  return patient;
};