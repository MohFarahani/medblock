// app/api/process-dicom/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create temporary directory if it doesn't exist
    const tmpDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });

    // Save the file temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(tmpDir, file.name);
    await fs.writeFile(filePath, buffer);

    // Path to Python executable in virtual environment
    const pythonPath = process.platform === 'win32'
      ? path.join(process.cwd(), 'python_env', 'venv', 'Scripts', 'python.exe')
      : path.join(process.cwd(), 'python_env', 'venv', 'bin', 'python');

    // Path to Python script
    const scriptPath = path.join(process.cwd(), 'python_env', 'scripts', 'process_dicom.py');

    // Execute Python script
    const { stdout } = await execAsync(`"${pythonPath}" "${scriptPath}" "${filePath}"`);
    
    // Parse the Python script output
    const result = JSON.parse(stdout);

    // Clean up: remove temporary file
    await fs.unlink(filePath);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error processing DICOM file:', error);
    return NextResponse.json(
      { error: 'Failed to process DICOM file' },
      { status: 500 }
    );
  }
}