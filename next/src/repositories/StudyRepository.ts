import { Study } from '../db/models/Study';
import { BaseRepository } from './BaseRepository';

export class StudyRepository extends BaseRepository<Study> {
  constructor() {
    super(Study);
  }

  async findByPatientId(patientId: number): Promise<Study[]> {
    return this.model.findAll({
      where: {
        idPatient: patientId,
      },
    });
  }
} 