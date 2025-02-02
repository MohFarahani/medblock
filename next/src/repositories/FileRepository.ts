import File from '../db/models/File';
import { BaseRepository } from './BaseRepository';
import { Patient, Study, Series, Modality } from '@/db/models';

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

  async findAllWithRelations(): Promise<File[]> {
    return this.model.findAll({
      include: [
        {
          model: Patient,
          attributes: ['Name'],
          required: true,
        },
        {
          model: Study,
          attributes: ['StudyDate', 'StudyName'],
          required: true,
        },
        {
          model: Series,
          attributes: ['SeriesName'],
          required: true,
          include: [
            {
              model: Modality,
              attributes: ['Name'],
              required: true,
            },
          ],
        },
      ],
    });
  }
}