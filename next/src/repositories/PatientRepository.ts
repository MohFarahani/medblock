import  Patient  from '../db/models/Patient';
import { BaseRepository } from './BaseRepository';

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
} 