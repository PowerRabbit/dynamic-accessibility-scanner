import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  const filePath = resolve('node_modules', 'axe-core', 'axe.min.js');

  try {
    const fileBuffer = await readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load axe.min.js' }, { status: 500 });
  }
}
