import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // For now, skip middleware auth check - we'll do it client-side
    // This allows the pages to load without server-side auth complexity
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
