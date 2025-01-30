import { models } from '@/db/models';
import { sequelize } from '@/db/connection';
import { Transaction } from 'sequelize';
import type { DicomUploadInput } from './types';
import type { SqlError } from '@/types/errors';
// Custom error classes
export class DicomUploadError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DicomUploadError';
    Error.captureStackTrace(this, this.constructor);
  }
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const isDeadlockError = (error: unknown): error is SqlError => {
  return (
    error instanceof Error &&
    'original' in error &&
    (error as SqlError).original?.code === 'ER_LOCK_DEADLOCK'
  );
};

const formatDateString = (dateString: string): Date => {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  const formattedDate = `${year}-${month}-${day}`;
  return new Date(formattedDate);
};

const safeRollback = async (transaction: Transaction | null): Promise<void> => {
  if (!transaction) return;
  try {
    // Use transaction.rollback() directly, wrapped in try-catch
    await transaction.rollback();
  } catch (rollbackError) {
    // If the error is about the transaction already being rolled back, ignore it
    if (!(rollbackError instanceof Error) || 
        !rollbackError.message.includes('has been finished')) {
      console.error('Rollback error:', rollbackError);
    }
  }
};

const processDicomUploadWithRetry = async (input: DicomUploadInput, retryCount = 0) => {
  let transaction: Transaction | null = null;
  console.log('INPUT:', input);
  try {
    transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });

    const [patient] = await models.Patient.findOrCreate({
      where: { Name: input.patientName },
      defaults: { 
        Name: input.patientName,
        CreatedDate: new Date() 
      },
      transaction,
      lock: true
    });

    const study = await models.Study.create({
      idPatient: patient.idPatient,
      StudyName: input.studyDescription || 'Unknown Study',
      StudyDate: formatDateString(input.studyDate),
      CreatedDate: new Date(),
    }, { transaction });

    const [modality] = await models.Modality.findOrCreate({
      where: { Name: input.modality },
      defaults: { Name: input.modality },
      transaction,
      lock: true
    });

    const series = await models.Series.create({
      idPatient: patient.idPatient,
      idStudy: study.idStudy,
      idModality: modality.idModality,
      SeriesName: input.seriesDescription || 'Unknown Series',
      CreatedDate: new Date(),
    }, { transaction });

    const file = await models.File.create({
      idPatient: patient.idPatient,
      idStudy: study.idStudy,
      idSeries: series.idSeries,
      FilePath: input.filePath,
      CreatedDate: new Date(),
    }, { transaction });

    await transaction.commit();
    return file;

  } catch (error) {
    await safeRollback(transaction);

    if (isDeadlockError(error) && retryCount < MAX_RETRIES) {
      console.log(`Deadlock detected, retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return processDicomUploadWithRetry(input, retryCount + 1);
    }

    throw new DicomUploadError(
      'Failed to process DICOM upload',
      error
    );
  }
};

export const resolvers = {
  Query: {
    // Patient queries
    patients: async ( ) => {
      try {
        return await models.Patient.findAll({
          include: [{
            model: models.Study,
            include: [{
              model: models.Series,
              include: [models.File]
            }]
          }]
        });
      } catch (error) {
        console.error('Query patients error:', error);
        throw error;
      }
    },

    patient: async (_: unknown, { idPatient }: { idPatient: string }, ) => {
      try {
        const patient = await models.Patient.findByPk(idPatient, {
          include: [{
            model: models.Study,
            include: [{
              model: models.Series,
              include: [models.File]
            }]
          }]
        });

        if (!patient) {
          throw new Error(`Patient with ID ${idPatient} not found`);
        }

        return patient;
      } catch (error) {
        console.error('Query patient error:', error);
        throw error;
      }
    },

    // Study queries
    studies: async () => {
      try {
        return await models.Study.findAll({
          include: [{
            model: models.Series,
            include: [models.File]
          }]
        });
      } catch (error) {
        console.error('Query studies error:', error);
        throw error;
      }
    },

    study: async (_: unknown, { idStudy }: { idStudy: string }, ) => {
      try {
        const study = await models.Study.findByPk(idStudy, {
          include: [{
            model: models.Series,
            include: [models.File]
          }]
        });

        if (!study) {
          throw new Error(`Study with ID ${idStudy} not found`);
        }

        return study;
      } catch (error) {
        console.error('Query study error:', error);
        throw error;
      }
    },

    // Series queries
    allSeries: async () => {
      try {
        return await models.Series.findAll({
          include: [models.File]
        });
      } catch (error) {
        console.error('Query series error:', error);
        throw error;
      }
    },

    series: async (_: unknown, { idSeries }: { idSeries: string }, ) => {
      try {
        const series = await models.Series.findByPk(idSeries, {
          include: [models.File]
        });

        if (!series) {
          throw new Error(`Series with ID ${idSeries} not found`);
        }

        return series;
      } catch (error) {
        console.error('Query series error:', error);
        throw error;
      }
    },

    // File queries
    files: async ()  => {
      try {
        return await models.File.findAll();
      } catch (error) {
        console.error('Query files error:', error);
        throw error;
      }
    },

    file: async (_: unknown, { idFile }: { idFile: string }, ) => {
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
  },

  Mutation: {
    processDicomUpload: async (_: unknown, { input }: { input: DicomUploadInput }, ) => {
      try {
        console.log('HERE Starting DICOM upload processing with input:', input);
        const result = await processDicomUploadWithRetry(input);
        console.log('DICOM upload processing completed successfully');
        return result;
      } catch (error) {
        console.error('Error in processDicomUpload:', error);
        throw new Error(
          error instanceof Error 
            ? `DICOM upload processing failed: ${error.message}`
            : 'DICOM upload processing failed'
        );
      }
    },
  },

  // Field resolvers for relationships
  Patient: {
    studies: async (parent: { idPatient: string }) => {
      return await models.Study.findAll({
        where: { idPatient: parent.idPatient }
      });
    }
  },

  Study: {
    patient: async (parent: { idPatient: string }) => {
      return await models.Patient.findByPk(parent.idPatient);
    },
    series: async (parent: { idStudy: string }) => {
      return await models.Series.findAll({
        where: { idStudy: parent.idStudy }
      });
    }
  },

  Series: {
    study: async (parent: { idStudy: string }) => {
      return await models.Study.findByPk(parent.idStudy);
    },
    modality: async (parent: { idModality: string }) => {
      return await models.Modality.findByPk(parent.idModality);
    },
    files: async (parent: { idSeries: string }) => {
      return await models.File.findAll({
        where: { idSeries: parent.idSeries }
      });
    }
  },

  File: {
    series: async (parent: { idSeries: string }) => {
      return await models.Series.findByPk(parent.idSeries);
    },
    study: async (parent: { idStudy: string }) => {
      return await models.Study.findByPk(parent.idStudy);
    },
    patient: async (parent: { idPatient: string }) => {
      return await models.Patient.findByPk(parent.idPatient);
    }
  }
};