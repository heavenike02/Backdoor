import cookie from 'cookie';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('Received request:', req.method, req.nextUrl.searchParams);

  if (req.method === 'GET') {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const organizationId = cookies.organizationId;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is missing' },
        { status: 400 },
      );
    }
    try {
      const ref = req.nextUrl.searchParams.get('ref');

      if (!ref) {
        throw new Error('Ref ID is missing. - No Bank Authorization');
      }
      console.log('Received Reference ID:', ref);

      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/organization/${organizationId}/bank-details`;
      console.log('Redirecting to:', redirectUrl);
      return NextResponse.redirect(redirectUrl);
    } catch (error) {
      console.error('Error in fetching bank account data:', {
        message: error.message,
        stack: error.stack,
        response: error.response ? error.response.data : 'No response data',
      });
      return NextResponse.json(
        { error: 'Failed to handle redirect' },
        { status: 500 },
      );
    }
  }
}

// Default handler for unsupported methods
export function handler(req: NextRequest) {
  if (req.method !== 'GET') {
    return NextResponse.json(
      { message: 'Method Not Allowed' },
      { status: 405 },
    );
  }
}
