export const adminRealm = 'Trust Property Administration';

export function isAdminRequestAuthorized(request: Pick<Request, 'headers'>): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUsername || !expectedPassword) return false;

  const credentials = readBasicCredentials(request.headers.get('authorization'));
  if (!credentials) return false;
  return constantTimeEqual(credentials.username, expectedUsername)
    && constantTimeEqual(credentials.password, expectedPassword);
}

export function areKnowledgeWritesEnabled(): boolean {
  return process.env.KNOWLEDGE_WRITES_ENABLED === 'true';
}

function readBasicCredentials(value: string | null): {username: string; password: string} | null {
  if (!value?.startsWith('Basic ')) return null;
  try {
    const decoded = atob(value.slice(6));
    const separator = decoded.indexOf(':');
    if (separator < 1) return null;
    return {username: decoded.slice(0, separator), password: decoded.slice(separator + 1)};
  } catch {
    return null;
  }
}

function constantTimeEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}
