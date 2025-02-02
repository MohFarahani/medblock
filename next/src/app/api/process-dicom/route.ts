import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { AppError, handleApiError } from '@/utils/errorHandling';

const execAsync = promisify(exec);

// Types
interface PythonConfig {
  venvPath: string;
  scriptPath: string;
  pythonPath: string;
}

interface ProcessOptions {
  filePath: string;
  shouldCleanup?: boolean;
}

// Constants
const PROJECT_ROOT = process.cwd();
const PYTHON_CONFIG: PythonConfig = {
  venvPath: path.join(PROJECT_ROOT, 'python_env', 'venv'),
  scriptPath: path.join(PROJECT_ROOT, 'python_env', 'scripts', 'python', 'process_dicom.py'),
  pythonPath: path.join(PROJECT_ROOT, 'python_env', 'venv', 'bin', 'python3'),
};

// Utility Functions
class FileService {
  static readonly DICOM_FOLDER = path.join(PROJECT_ROOT, 'dicom_files');

  static async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  static async ensureDicomFolder(): Promise<void> {
    try {
      await fs.access(FileService.DICOM_FOLDER);
    } catch {
      await fs.mkdir(FileService.DICOM_FOLDER, { recursive: true });
    }
  }

  static async createTempFile(file: File): Promise<string> {
    // Ensure the dicom_files folder exists
    await FileService.ensureDicomFolder();

    // Use the original file name
    const fileName = file.name;
    const filePath = path.join(FileService.DICOM_FOLDER, fileName);

    try {
      // Convert File to Buffer and save it
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      console.log(`File saved successfully at: ${filePath}`); // Debug log
      return filePath;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Failed to save file');
    }
  }

  static async cleanup(filePath: string): Promise<void> {
    try {
      if (await FileService.exists(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

class PythonService {
  static async verifyEnvironment(): Promise<void> {
    try {
      await fs.access(PYTHON_CONFIG.pythonPath);
      
      const checkNumpy = `${PYTHON_CONFIG.pythonPath} -c "import numpy; print('numpy version:', numpy.__version__)"`;
      const { stdout: numpyVersion } = await execAsync(checkNumpy);
      console.log('Numpy check:', numpyVersion.trim());
    } catch  {
      throw new Error('Python environment verification failed');
    }
  }

  static async executeScript(filePath: string) {
    const command = `${PYTHON_CONFIG.pythonPath} "${PYTHON_CONFIG.scriptPath}" "${filePath}" "json" "False"`;
    
    const { stdout, stderr } = await execAsync(command, {
      env: {
        ...process.env,
        PYTHONPATH: path.join(PYTHON_CONFIG.venvPath, 'lib', 'python3.9', 'site-packages'),
      }
    });

    if (stderr) {
      console.error('Python stderr:', stderr);
    }

    return JSON.parse(stdout);
  }
}

class RequestHandler {
  static async handleFileUpload(request: NextRequest): Promise<ProcessOptions> {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Received file:', file.name); // Debug log

    try {
      const filePath = await FileService.createTempFile(file);
      console.log('File saved at:', filePath); // Debug log
      return { filePath, shouldCleanup: false };
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      throw error;
    }
  }


  static async handleFilePath(request: NextRequest): Promise<ProcessOptions> {
    const body = await request.json();
    
    if (!body.filePath) {
      throw new Error('No file path provided');
    }

    if (!(await FileService.exists(body.filePath))) {
      throw new Error('File does not exist');
    }

    return { filePath: body.filePath, shouldCleanup: false };
  }
}

// Main Handler
export async function POST(request: NextRequest) {
  try {
    // Determine request type and get file path
    const contentType = request.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');
    
    console.log('Request content type:', contentType); // Debug log

    const processOptions = isMultipart
      ? await RequestHandler.handleFileUpload(request)
      : await RequestHandler.handleFilePath(request);

    if (!processOptions) {
      throw new AppError('Failed to process request', 'PROCESSING_ERROR', 400);
    }

    console.log('Process options:', processOptions); // Debug log

    // Verify Python environment
    await PythonService.verifyEnvironment();

    // Process file
    const result = await PythonService.executeScript(processOptions.filePath);

    // Cleanup if necessary
    if (processOptions.shouldCleanup) {
      await FileService.cleanup(processOptions.filePath);
    }

    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
}