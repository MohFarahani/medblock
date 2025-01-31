import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = request.nextUrl.searchParams.get('filePath');
    
    if (!filePath) {
      return new Response('No file path provided', { status: 400 });
    }

    // Verify file exists
    try {
      await fs.access(filePath);
    } catch {
      return new Response('File not found', { status: 404 });
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
    console.error('Download error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}