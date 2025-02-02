import { z } from 'zod';
import { AppError } from '@/utils/errorHandling';
import { LogService } from '@/utils/logging';

export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown, operation: string): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => issue.message).join(', ');
      LogService.error(`Validation failed for ${operation}`, error, { issues });
      throw new AppError(
        `Validation failed: ${issues}`,
        'VALIDATION_ERROR',
        400
      );
    }
    throw error;
  }
}; 