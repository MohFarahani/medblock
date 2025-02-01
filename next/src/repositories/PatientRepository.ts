import  Patient  from '../db/models/Patient';
import { BaseRepository } from './BaseRepository';
import { Transaction } from 'sequelize';

export class PatientRepository extends BaseRepository<Patient> {
  constructor() {
    super(Patient);
  }

  async findByName(name: string): Promise<Patient[]> {
    return this.model.findAll({
      where: {
        Name: name,
      },
    });
  }

  async findOrCreate(data: { Name: string; CreatedDate: Date }, options?: { transaction?: Transaction }): Promise<[Patient, boolean]> {
    return this.model.findOrCreate({
      where: { Name: data.Name },
      defaults: data,
      transaction: options?.transaction,
      lock: true
    });
  }
} 