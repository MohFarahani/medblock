import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/utils/errorHandling';
import { LogService } from '@/utils/logging';
import { FileService } from '@/utils/FileService';
import { PythonService } from '@/utils/PythonService';
import { RequestHandlerService } from '@/utils/RequestHandlerService';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');
    
    LogService.debug('Processing request', { contentType, isMultipart });

    const processOptions = isMultipart
      ? await RequestHandlerService.handleFileUpload(request)
      : await RequestHandlerService.handleFilePath(request);

    await PythonService.verifyEnvironment();
    const result = await PythonService.executeScript(processOptions.filePath);

    if (processOptions.shouldCleanup) {
      await FileService.cleanup(processOptions.filePath);
    }

    return NextResponse.json(result);

  } catch (error) {
    LogService.error('Process DICOM route error', error);
    return handleApiError(error);
  }
}