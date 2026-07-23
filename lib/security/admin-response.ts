import {NextResponse} from 'next/server';
import {adminRealm, areKnowledgeWritesEnabled, isAdminRequestAuthorized} from '@/lib/security/admin-auth';

export function requireAdmin(request: Request): NextResponse | null {
  if (isAdminRequestAuthorized(request)) return null;
  return NextResponse.json(
    {error: 'Unauthorized'},
    {status: 401, headers: {'WWW-Authenticate': `Basic realm="${adminRealm}", charset="UTF-8"`}},
  );
}

export function requireKnowledgeWrites(request: Request): NextResponse | null {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;
  if (areKnowledgeWritesEnabled()) return null;
  return NextResponse.json({error: 'Knowledge writes are disabled in this environment.'}, {status: 403});
}
