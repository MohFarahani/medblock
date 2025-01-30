import { sequelize } from '@/db/connection';
import type { DicomUploadInput } from '@/graphql/types';
import type { Transaction } from 'sequelize';
import { isDeadlockError } from '@/utils/errors';
import { formatDateString } from '@/utils/dates';
import { createOrFindPatient } from './patient';
import { createStudy } from './study';
import { createOrFindModality } from './modality';
import { createSeries } from './series';
import { createFile } from './file';
import { SqlError } from '@/types/errors';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const rollbackTransaction = async (transaction: Transaction | null) => {
  if (transaction) {
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error('Rollback error:', rollbackError);
    }
  }
};

const processDicomUploadWithRetry = async (input: DicomUploadInput, retryCount = 0) => {
  let transaction: Transaction | null = null;
  
  try {
    transaction = await sequelize.transaction();

    // Create or find patient
    const patient = await createOrFindPatient(
      {
        Name: input.patientName,
        CreatedDate: new Date(),
      },
      transaction
    );

    // Create study
    const study = await createStudy(
      {
        idPatient: patient.idPatient,
        StudyName: input.studyDescription || 'Unknown Study',
        CreatedDate: formatDateString(input.studyDate),
      },
      transaction
    );

    // Create or find modality
    const modality = await createOrFindModality(
      {
        Name: input.modality,
      },
      transaction
    );

    // Create series
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

    // Create file
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

    await transaction.commit();
    return file;

  } catch (error) {
    await rollbackTransaction(transaction);

    if (isDeadlockError(error as SqlError) && retryCount < MAX_RETRIES) {
      console.log(`Deadlock detected, retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return processDicomUploadWithRetry(input, retryCount + 1);
    }

    throw error;
  }
};

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

// Add more specific error handling
export class TransactionError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}

export class RollbackError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'RollbackError';
  }
}

// Types for better type safety
export interface TransactionResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

// Helper function to handle transaction errors
export const handleTransactionError = (error: unknown): never => {
  if (error instanceof TransactionError || error instanceof RollbackError) {
    throw error;
  }

  throw new TransactionError(
    'Transaction failed',
    error
  );
};