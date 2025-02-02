import {  models } from '@/db/models';
import { FileInstance } from '@/db/models/File';
import { AppError, ErrorCodes } from '@/utils/errorHandling';
import { LogService } from '@/utils/logging';

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

  checkFilePathExists: async (_: unknown, { filePath }: { filePath: string }) => {
    try {
      if (!filePath) {
        throw new AppError('File path is required', ErrorCodes.MISSING_FILE, 400);
      }

      const file = await models.File.findOne({
        where: { FilePath: filePath }
      });
      
      LogService.debug('Checked file path existence', { filePath, exists: !!file });
      return !!file;

    } catch (error) {
      LogService.error('Failed to check file path existence', error, { filePath });
      
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        'Failed to check file existence',
        ErrorCodes.FILE_NOT_FOUND,
        500
      );
    }
  },
};