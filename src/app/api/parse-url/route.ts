import { NextRequest, NextResponse } from 'next/server';
import { parseUrl } from '@/lib/parsers';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const result = await parseUrl(url);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to parse URL' },
      { status: 500 }
    );
  }
}
