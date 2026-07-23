import {NextResponse, type NextRequest} from 'next/server';
import {adminRealm, isAdminRequestAuthorized} from '@/lib/security/admin-auth';

export function middleware(request: NextRequest) {
  if (isAdminRequestAuthorized(request)) return NextResponse.next();

  const isApiRequest = request.nextUrl.pathname.startsWith('/api/');
  if (isApiRequest) {
    return NextResponse.json(
      {error: 'Unauthorized'},
      {status: 401, headers: {'WWW-Authenticate': `Basic realm="${adminRealm}", charset="UTF-8"`}},
    );
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {'WWW-Authenticate': `Basic realm="${adminRealm}", charset="UTF-8"`},
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/knowledge-objects/:path*'],
};
