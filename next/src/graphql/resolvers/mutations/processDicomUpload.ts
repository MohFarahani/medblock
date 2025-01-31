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
  console.log('INPUT:', input);
  
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
      StudyDate: formatDateString(input.studyDate),
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

// Main resolver function
export const processDicomUpload = async (_: unknown, { input }: { input: DicomUploadInput }) => {
  try {
    console.log('Starting DICOM upload processing with input:', input);
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
};

// Export types for use in other files
export type { DicomUploadInput };