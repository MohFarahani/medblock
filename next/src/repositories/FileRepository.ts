import File from '../db/models/File';
import { BaseRepository } from './BaseRepository';

export class FileRepository extends BaseRepository<File> {
  constructor() {
    super(File);
  }

  async findBySeriesId(seriesId: number): Promise<File[]> {
    return this.model.findAll({
      where: {
        idSeries: seriesId,
      },
    });
  }

  async findByStudyId(studyId: number): Promise<File[]> {
    return this.model.findAll({
      where: {
        idStudy: studyId,
      },
    });
  }

  async findByPatientId(patientId: number): Promise<File[]> {
    return this.model.findAll({
      where: {
        idPatient: patientId,
      },
    });
  }
}