import {  models } from '@/db/models';
import { FileInstance } from '@/db/models/File';

export const fileQueries = {
  files: async () => {
    try {
      return await models.File.findAll();
    } catch (error) {
      console.error('Query files error:', error);
      throw error;
    }
  },

  file: async (_: unknown, { idFile }: { idFile: string }) => {
    try {
      const file = await models.File.findByPk(idFile);

      if (!file) {
        throw new Error(`File with ID ${idFile} not found`);
      }

      return file;
    } catch (error) {
      console.error('Query file error:', error);
      throw error;
    }
  },
  getAllDicomFiles: async () => {
    try {
      const files = await models.File.findAll({
        include: [
          {
            model: models.Patient,
            attributes: ['Name'],
            required: true,
          },
          {
            model: models.Study,
            attributes: ['StudyDate', 'StudyName'],
            required: true,
          },
          {
            model: models.Series,
            attributes: ['SeriesName'],
            required: true,
            include: [
              {
                model: models.Modality,
                attributes: ['Name'],
                required: true,
              },
            ],
          },
        ],
      });

      return files.map((file: FileInstance) => ({
        PatientName: file.Patient?.Name ?? '',
        StudyDate: file.Study?.StudyDate?.toISOString() ?? '',
        StudyDescription: file.Study?.StudyName ?? '',
        SeriesDescription: file.Series?.SeriesName ?? '',
        Modality: file.Series?.Modality?.Name ?? '',
        FilePath: file.FilePath,
      }));
    } catch (error) {
      console.error('Query getAllDicomFiles error:', error);
      throw error;
    }
  },

};