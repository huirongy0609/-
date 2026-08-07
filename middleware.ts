import {NextResponse, type NextRequest} from 'next/server';

const adminRealm = 'Trust Property Administration';

function constantTimeEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

function isAdminRequestAuthorized(request: NextRequest): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const authorization = request.headers.get('authorization');
  if (!expectedUsername || !expectedPassword || !authorization?.startsWith('Basic ')) return false;
  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(':');
    if (separator < 1) return false;
    return constantTimeEqual(decoded.slice(0, separator), expectedUsername)
      && constantTimeEqual(decoded.slice(separator + 1), expectedPassword);
  } catch {
    return false;
  }
}

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
