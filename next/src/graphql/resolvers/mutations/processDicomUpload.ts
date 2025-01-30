import { sequelize } from '@/db/connection';
import type { DicomUploadInput } from '@/graphql/types';
import { Transaction } from 'sequelize';
import { isDeadlockError } from '@/utils/errors';
import { formatDateString } from '@/utils/dates';
import { createOrFindPatient } from './patient';
import { createStudy } from './study';
import { createOrFindModality } from './modality';
import { createSeries } from './series';
import { createFile } from './file';
import { SqlError } from '@/types/errors';

interface FileResult {
  idFile: number;
  idPatient: number;
  idStudy: number;
  idSeries: number;
  FilePath: string;
  CreatedDate: Date;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

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

const processDicomUploadWithRetry = async (
  input: DicomUploadInput, 
  retryCount = 0
): Promise<FileResult> => {
  let transaction: Transaction | null = null;
  try {
    // Start a new transaction
    transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });

    // Perform all database operations
    const patient = await createOrFindPatient(
      {
        Name: input.patientName,
        CreatedDate: new Date(),
      },
      transaction
    );

    const study = await createStudy(
      {
        idPatient: patient.idPatient,
        StudyName: input.studyDescription || 'Unknown Study',
        StudyDate: formatDateString(input.studyDate),
        CreatedDate: formatDateString(input.studyDate),
      },
      transaction
    );

    const modality = await createOrFindModality(
      {
        Name: input.modality,
      },
      transaction
    );

    const series = await createSeries(
      {
        idPatient: patient.idPatient,
        idStudy: study.idStudy,
        idModality: modality.idModality,
        SeriesName: input.seriesDescription || 'Unknown Series',
        CreatedDate: new Date(),
      },
      transaction
    );

    const file = await createFile(
      {
        idPatient: patient.idPatient,
        idStudy: study.idStudy,
        idSeries: series.idSeries,
        FilePath: input.filePath,
        CreatedDate: new Date(),
      },
      transaction
    );

    // Commit the transaction
    await transaction.commit();
    return file;

  } catch (error) {
    // Safely handle rollback
    await safeRollback(transaction);

    if (isDeadlockError(error as SqlError) && retryCount < MAX_RETRIES) {
      console.log(`Deadlock detected, retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return processDicomUploadWithRetry(input, retryCount + 1);
    }

    // Wrap the error in a custom error class
    throw new DicomUploadError(
      'Failed to process DICOM upload',
      error
    );
  }
};

export const processDicomUpload = async (
  _: unknown, 
  { input }: { input: DicomUploadInput }
): Promise<FileResult> => {
  try {
    console.log('Starting DICOM upload processing with input:', input);
    const result = await processDicomUploadWithRetry(input);
    console.log('DICOM upload processing completed successfully');
    return result;
  } catch (error) {
    console.error('Error in processDicomUpload:', error);
    
    if (error instanceof DicomUploadError) {
      throw error;
    }
    
    throw new DicomUploadError(
      'DICOM upload processing failed',
      error
    );
  }
};

// Custom error classes
export class DicomUploadError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'DicomUploadError';
    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TransactionError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'TransactionError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Type guards and helper functions
export const isDicomUploadError = (error: unknown): error is DicomUploadError => {
  return error instanceof DicomUploadError;
};

export const handleUploadError = (error: unknown): never => {
  if (isDicomUploadError(error)) {
    throw error;
  }
  throw new DicomUploadError('Upload failed', error);
};