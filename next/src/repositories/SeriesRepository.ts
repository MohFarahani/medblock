import  Series  from '../db/models/Series';
import { BaseRepository } from './BaseRepository';

export class SeriesRepository extends BaseRepository<Series> {
  constructor() {
    super(Series);
  }

  async findByStudyId(studyId: number): Promise<Series[]> {
    return this.model.findAll({
      where: {
        idStudy: studyId,
      },
    });
  }

  async findByModalityId(modalityId: number): Promise<Series[]> {
    return this.model.findAll({
      where: {
        idModality: modalityId,
      },
    });
  }
} 