import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AppError, handleApiError } from '@/utils/errorHandling';

export async function GET(request: NextRequest) {
  try {
    const filePath = request.nextUrl.searchParams.get('filePath');
    
    if (!filePath) {
      throw new AppError('No file path provided', 'MISSING_FILE_PATH', 400);
    }

    // Verify file exists
    try {
      await fs.access(filePath);
    } catch {
      throw new AppError('File not found', 'FILE_NOT_FOUND', 404);
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    // Return file as download with correct headers
    return new Response(fileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}