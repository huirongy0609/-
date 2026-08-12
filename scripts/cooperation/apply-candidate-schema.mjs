import {readFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import pg from 'pg';

function connectionString() {
  const direct = process.env.COOPERATION_DATABASE_URL?.trim();
  if (direct) return direct;
  const required = ['COOPERATION_DATABASE_HOST', 'COOPERATION_DATABASE_NAME',
    'COOPERATION_DATABASE_USER', 'COOPERATION_DATABASE_PASSWORD'];
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) throw new Error(`missing database configuration: ${missing.join(', ')}`);
  const url = new URL('postgresql://candidate.invalid');
  url.hostname = process.env.COOPERATION_DATABASE_HOST.trim();
  url.port = process.env.COOPERATION_DATABASE_PORT?.trim() || '5432';
  url.username = process.env.COOPERATION_DATABASE_USER;
  url.password = process.env.COOPERATION_DATABASE_PASSWORD;
  url.pathname = `/${process.env.COOPERATION_DATABASE_NAME.trim()}`;
  return url.toString();
}

const certificateFile = process.env.COOPERATION_DATABASE_CA_CERT_FILE?.trim();
if (!certificateFile) throw new Error('COOPERATION_DATABASE_CA_CERT_FILE is required');
const runtimeDatabaseUser = process.env.COOPERATION_RUNTIME_DATABASE_USER?.trim();
if (!runtimeDatabaseUser) throw new Error('COOPERATION_RUNTIME_DATABASE_USER is required');
const quoteIdentifier = (value) => `"${value.replaceAll('"', '""')}"`;
const schema = await readFile(new URL('../../db/cooperation/001_initial.sql', import.meta.url), 'utf8');
const grantsTemplate = await readFile(
  new URL('../../db/cooperation/002_runtime_grants.sql', import.meta.url),
  'utf8',
);
const grants = grantsTemplate.replaceAll(
  '__COOPERATION_RUNTIME_DATABASE_USER__',
  quoteIdentifier(runtimeDatabaseUser),
);
const client = new pg.Client({
  connectionString: connectionString(),
  ssl: {ca: readFileSync(certificateFile, 'utf8'), rejectUnauthorized: true},
});

await client.connect();
try {
  await client.query('BEGIN');
  await client.query(schema);
  await client.query(grants);
  await client.query('COMMIT');
  const result = await client.query(`SELECT
    current_database() AS database_name,
    current_user AS database_user,
    (SELECT count(*)::int FROM pg_tables WHERE schemaname = 'public'
      AND tablename LIKE 'cooperation_%') AS cooperation_tables,
    (SELECT ssl FROM pg_stat_ssl WHERE pid = pg_backend_pid()) AS ssl,
    has_table_privilege($1, 'public.cooperation_registration', 'SELECT')
      AND has_table_privilege($1, 'public.cooperation_registration', 'INSERT')
      AND has_table_privilege($1, 'public.cooperation_admin_user', 'SELECT')
      AND has_table_privilege($1, 'public.cooperation_audit_log', 'INSERT')
      AND NOT has_table_privilege($1, 'public.cooperation_audit_log', 'SELECT')
      AS runtime_privileges`, [runtimeDatabaseUser]);
  console.log(JSON.stringify({
    migrations: ['001_initial.sql', '002_runtime_grants.sql'],
    runtime_database_user: runtimeDatabaseUser,
    ...result.rows[0],
  }));
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  await client.end();
}
