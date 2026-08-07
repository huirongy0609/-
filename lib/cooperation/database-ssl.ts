export function postgresConnectionOptions(connectionString: string) {
  if (process.env.COOPERATION_DATABASE_SSL === 'disable') {
    return {connectionString, ssl: false as const};
  }

  const url = new URL(connectionString);
  url.searchParams.delete('sslmode');
  url.searchParams.delete('sslrootcert');

  const certificate = process.env.SUPABASE_DB_CA_CERT?.replace(/\\n/g, '\n').trim();
  return {
    connectionString: url.toString(),
    ssl: certificate
      ? {ca: certificate, rejectUnauthorized: true}
      : {rejectUnauthorized: true},
  };
}
