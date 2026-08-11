import {readFileSync} from 'node:fs';

export function postgresConnectionOptions(connectionString: string) {
  if (process.env.COOPERATION_DATABASE_SSL === 'disable') {
    return {connectionString, ssl: false as const};
  }

  const url = new URL(connectionString);
  url.searchParams.delete('sslmode');
  url.searchParams.delete('sslrootcert');

  const certificateFile = process.env.COOPERATION_DATABASE_CA_CERT_FILE?.trim();
  const certificate = (
    certificateFile
      ? readFileSync(certificateFile, 'utf8')
      : process.env.COOPERATION_DATABASE_CA_CERT || process.env.SUPABASE_DB_CA_CERT
  )?.replace(/\\n/g, '\n').trim();
  return {
    connectionString: url.toString(),
    ssl: certificate
      ? {ca: certificate, rejectUnauthorized: true}
      : {rejectUnauthorized: true},
  };
}
