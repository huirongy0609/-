type DatabaseEnvironment = Record<string, string | undefined>;

export function cooperationDatabaseConnectionString(env: DatabaseEnvironment = process.env) {
  const direct = (
    env.COOPERATION_DATABASE_URL
    || env.POSTGRES_URL
    || env.POSTGRES_URL_NON_POOLING
  )?.trim();
  if (direct) return direct;

  const host = env.COOPERATION_DATABASE_HOST?.trim();
  const port = env.COOPERATION_DATABASE_PORT?.trim() || '5432';
  const database = env.COOPERATION_DATABASE_NAME?.trim();
  const username = env.COOPERATION_DATABASE_USER?.trim();
  const password = env.COOPERATION_DATABASE_PASSWORD || '';
  const missing = [
    ['COOPERATION_DATABASE_HOST', host],
    ['COOPERATION_DATABASE_NAME', database],
    ['COOPERATION_DATABASE_USER', username],
    ['COOPERATION_DATABASE_PASSWORD', password],
  ].filter(([, value]) => !value).map(([name]) => name);
  if (missing.length) {
    throw new Error(`Cooperation database configuration is incomplete: ${missing.join(', ')}`);
  }

  const url = new URL('postgresql://localhost');
  url.hostname = host!;
  url.port = port;
  url.username = username!;
  url.password = password;
  url.pathname = `/${database}`;
  return url.toString();
}
