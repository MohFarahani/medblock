import { NextRequest, NextResponse } from 'next/server';
import { FileService } from '@/utils/FileService';
import { PythonService } from '@/utils/PythonService';
import { RequestHandlerService } from '@/utils/RequestHandlerService';
import { wrapApiHandler } from '@/utils/apiWrapper';

export const POST = wrapApiHandler(async (request: NextRequest) => {
  const contentType = request.headers.get('content-type') || '';
  const isMultipart = contentType.includes('multipart/form-data');
  
  const processOptions = isMultipart
    ? await RequestHandlerService.handleFileUpload(request)
    : await RequestHandlerService.handleFilePath(request);

  await PythonService.verifyEnvironment();
  const result = await PythonService.executeScript(processOptions.filePath);

  if (processOptions.shouldCleanup) {
    await FileService.cleanup(processOptions.filePath);
  }

  return NextResponse.json(result);
});