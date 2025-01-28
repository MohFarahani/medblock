import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Create temporary directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Save the file temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(tempDir, file.name);
    await fs.writeFile(filePath, buffer);

    // Execute Python script
    const scriptPath = path.join(process.cwd(), 'python', 'process_dicom.py');
    const { stdout } = await execAsync(`python "${scriptPath}" "${filePath}"`);

    // Clean up the temporary file
    await fs.unlink(filePath);

    // Parse the Python script output
    const result = JSON.parse(stdout);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing DICOM file:', error);
    return NextResponse.json(
      { error: 'Failed to process DICOM file' },
      { status: 500 }
    );
  }
}