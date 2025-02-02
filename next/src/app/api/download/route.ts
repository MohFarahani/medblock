import { NextRequest } from 'next/server';
import { AppError, handleApiError } from '@/utils/errorHandling';
import { FileService } from '@/utils/FileService';

export async function GET(request: NextRequest) {
  try {
    const filePath = request.nextUrl.searchParams.get('filePath');
    
    if (!filePath) {
      throw new AppError('No file path provided', 'MISSING_FILE_PATH', 400);
    }

    await FileService.verifyFile(filePath);
    const { fileBuffer, fileName } = await FileService.readFile(filePath);

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