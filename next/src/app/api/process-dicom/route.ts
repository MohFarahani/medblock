import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  console.log('API route hit');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create temporary directory if it doesn't exist
    const tmpDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });

    // Save the file temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(tmpDir, file.name);
    await fs.writeFile(filePath, buffer);

    // Get paths
    const projectRoot = process.cwd();
    const venvPythonPath = path.join(
      projectRoot,
      'python_env',
      'venv',
      'bin',
      'python3'
    );
    const scriptPath = path.join(
      projectRoot,
      'python_env',
      'scripts',
      'python',
      'process_dicom.py'
    );

    // Verify Python and numpy installation
    try {
      // Check if virtual environment Python exists
      await fs.access(venvPythonPath);
      console.log('Found Python at:', venvPythonPath);

      // Check numpy installation
      const checkNumpy = `${venvPythonPath} -c "import numpy; print('numpy version:', numpy.__version__)"`;
      const { stdout: numpyVersion } = await execAsync(checkNumpy);
      console.log('Numpy check:', numpyVersion.trim());

    } catch (error) {
      console.error('Python/numpy verification failed:', error);
      throw new Error('Python environment is not properly set up');
    }

    // Execute Python script with absolute path to virtual environment Python
    const command = `${venvPythonPath} "${scriptPath}" "${filePath}" "json" "False"`;
    console.log('Executing command:', command);

    const { stdout, stderr } = await execAsync(command, {
      env: {
        ...process.env,
        PYTHONPATH: path.join(projectRoot, 'python_env', 'venv', 'lib', 'python3.9', 'site-packages'),
      }
    });

    // Clean up temporary file
    await fs.unlink(filePath).catch(console.error);

    if (stderr) {
      console.error('Python stderr:', stderr);
    }

    console.log('Python stdout:', stdout);

    try {
      const result = JSON.parse(stdout);
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('Failed to parse Python output:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse Python output', details: stdout },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing DICOM file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process DICOM file', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}