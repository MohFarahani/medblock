import { sequelize } from '@/db/connection';
import { Transaction } from 'sequelize';
import type { DicomUploadInput } from '../../types';
import type { SqlError } from '@/types/errors';

// Import mutation functions
import { createOrFindPatient } from './patient';
import { createStudy } from './study';
import { createOrFindModality } from './modality';
import { createSeries } from './series';
import { createFile } from './file';

// Custom error class
export class DicomUploadError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'DicomUploadError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Utility functions
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

const isDeadlockError = (error: unknown): error is SqlError => {
  return (
    error instanceof Error &&
    'original' in error &&
    (error as SqlError).original?.code === 'ER_LOCK_DEADLOCK'
  );
};



const safeRollback = async (transaction: Transaction | null): Promise<void> => {
  if (!transaction) return;
  try {
    await transaction.rollback();
  } catch (rollbackError) {
    if (!(rollbackError instanceof Error) || 
        !rollbackError.message.includes('has been finished')) {
      console.error('Rollback error:', rollbackError);
    }
  }
};

const processDicomUploadWithRetry = async (input: DicomUploadInput, retryCount = 0) => {
  let transaction: Transaction | null = null;
  
  try {
    // Start transaction
    transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });

    // Create or find patient
    const patient = await createOrFindPatient({
      Name: input.patientName,
      CreatedDate: new Date()
    }, transaction);

    // Create study
    const study = await createStudy({
      idPatient: patient.idPatient,
      StudyName: input.studyDescription || 'Unknown Study',
      StudyDate: DateService.formatDateString(input.studyDate),
      CreatedDate: new Date(),
    }, transaction);

    // Create or find modality
    const modality = await createOrFindModality({
      Name: input.modality
    }, transaction);

    // Create series
    const series = await createSeries({
      idPatient: patient.idPatient,
      idStudy: study.idStudy,
      idModality: modality.idModality,
      SeriesName: input.seriesDescription || 'Unknown Series',
      CreatedDate: new Date(),
    }, transaction);

    // Create file
    const file = await createFile({
      idPatient: patient.idPatient,
      idStudy: study.idStudy,
      idSeries: series.idSeries,
      FilePath: input.filePath,
      CreatedDate: new Date(),
    }, transaction);

    // Commit transaction
    await transaction.commit();
    return file;

  } catch (error) {
    // Rollback transaction on error
    await safeRollback(transaction);

    // Retry on deadlock
    if (isDeadlockError(error) && retryCount < MAX_RETRIES) {
      console.log(`Deadlock detected, retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return processDicomUploadWithRetry(input, retryCount + 1);
    }

    // Throw custom error
    throw new DicomUploadError(
      'Failed to process DICOM upload',
      error
    );
  }
};

import { validateInput } from '@/graphql/validation/validator';
import { dicomUploadSchema } from '@/graphql/validation/schemas';
import { LogService } from '@/utils/logging';
import { AppError } from '@/utils/errorHandling';
import { DateService } from '@/utils/dates';

// Main resolver function
export const processDicomUpload = async (_: unknown, { input }: { input: DicomUploadInput }) => {
  try {
    LogService.debug('Starting DICOM upload validation', { input });
    
    // Validate input
    const validatedInput = validateInput(
      dicomUploadSchema,
      input,
      'processDicomUpload'
    );

    LogService.info('Starting DICOM upload processing', { 
      patientName: validatedInput.patientName,
      studyDate: validatedInput.studyDate,
      modality: validatedInput.modality 
    });

    const result = await processDicomUploadWithRetry(validatedInput);
    
    LogService.info('DICOM upload processing completed successfully', {
      fileId: result.idFile,
      filePath: result.FilePath
    });
    
    return result;
    
  } catch (error) {
    LogService.error('Error in processDicomUpload', error);
    
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(
      error instanceof Error 
        ? `DICOM upload processing failed: ${error.message}`
        : 'DICOM upload processing failed',
      'DICOM_UPLOAD_ERROR',
      500
    );
  }
};

// Export types for use in other files
export type { DicomUploadInput };