import {  models } from '@/db/models';
import { FileInstance } from '@/db/models/File';
import { AppError, ErrorCodes } from '@/utils/errorHandling';
import { LogService } from '@/utils/logging';
import { validateInput } from '@/graphql/validation/validator';
import { fileIdSchema, filePathSchema, FileIdSchema, FilePathSchema } from '@/graphql/validation/schemas';

export const fileQueries = {
  files: async () => {
    try {
      return await models.File.findAll();
    } catch (error) {
      console.error('Query files error:', error);
      throw error;
    }
  },

  file: async (_: unknown, args: FileIdSchema) => {
    try {
      const { idFile } = validateInput(fileIdSchema, args, 'file query');
      
      const file = await models.File.findByPk(idFile);
      
      if (!file) {
        throw new AppError(
          `File with ID ${idFile} not found`,
          ErrorCodes.FILE_NOT_FOUND,
          404
        );
      }

      return file;
    } catch (error) {
      LogService.error('Query file error', error, { idFile: args.idFile });
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

  checkFilePathExists: async (_: unknown, args: FilePathSchema) => {
    try {
      const { filePath } = validateInput(filePathSchema, args, 'checkFilePathExists');

      const file = await models.File.findOne({
        where: { FilePath: filePath }
      });
      
      LogService.debug('Checked file path existence', { 
        filePath, 
        exists: !!file 
      });
      
      return !!file;

    } catch (error) {
      LogService.error('Failed to check file path existence', error, { 
        filePath: args.filePath 
      });
      
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