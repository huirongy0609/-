import fs from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {Client} from 'pg';

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const sourcePath = argument('--source');
const backupPath = argument('--backup');
const reportPath = argument('--report');
const confirmation = argument('--confirm-staging');
const expectedConfirmation = 'xintuozhiwuye-cooperation-staging';
const connectionString = process.env.POSTGRES_URL_NON_POOLING
  || process.env.COOPERATION_DATABASE_URL
  || process.env.POSTGRES_URL;

if (!sourcePath || !backupPath || !reportPath || confirmation !== expectedConfirmation) {
  throw new Error('Required: --source, --backup, --report and --confirm-staging xintuozhiwuye-cooperation-staging');
}
if (!connectionString) throw new Error('Staging PostgreSQL connection is not configured');

const schema = await fs.readFile(new URL('../../db/cooperation/001_initial.sql', import.meta.url), 'utf8');
const source = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
const sourceRecords = Array.isArray(source.records) ? source.records : [];
const client = new Client({connectionString, ssl: {rejectUnauthorized: true}});

const tables = [
  'cooperation_organization',
  'cooperation_registration',
  'cooperation_partner_status',
  'cooperation_col_sequence',
  'cooperation_admin_user',
  'cooperation_audit_log',
];

async function resetCooperationSchema() {
  await client.query(`
    DROP TABLE IF EXISTS cooperation_audit_log;
    DROP TABLE IF EXISTS cooperation_admin_user;
    DROP TABLE IF EXISTS cooperation_partner_status;
    DROP TABLE IF EXISTS cooperation_registration;
    DROP TABLE IF EXISTS cooperation_organization;
    DROP TABLE IF EXISTS cooperation_col_sequence;
    DROP FUNCTION IF EXISTS cooperation_reject_audit_mutation();
  `);
  await client.query(schema);
}

async function importHistory(records) {
  for (const row of records) {
    const match = /^COL-(\d{4})-(\d{4,})$/.exec(row.leadNumber || '');
    if (!match) throw new Error('Historical source contains an invalid COL number');
    const directions = Array.isArray(row.cooperationDirections)
      ? row.cooperationDirections
      : JSON.parse(row.cooperationDirections || '[]');
    const organizationId = randomUUID();
    const registrationId = randomUUID();
    await client.query('BEGIN');
    try {
      await client.query(`INSERT INTO cooperation_organization
        (id, name, city, website, partner_type, created_at, updated_at)
        VALUES ($1, $2, $3, NULLIF($4, ''), $5, $6, $6)`,
      [organizationId, row.organizationName, row.city, row.organizationWebsite || '', row.partnerType, row.submittedAt]);
      await client.query(`INSERT INTO cooperation_registration
        (id, lead_number, organization_id, contact_name, phone, wechat, email,
         cooperation_directions, current_status, notes, source_page, consent_data_use,
         submitted_at, created_at)
        VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''), NULLIF($7, ''), $8, $9,
          NULLIF($10, ''), $11, $12, $13, $13)`,
      [registrationId, row.leadNumber, organizationId, row.contactName, row.phone,
        row.wechat || '', row.email || '', directions, row.currentStatus, row.notes || '',
        row.sourcePage || '/cooperation/register', row.consentDataUse === true || row.consentDataUse === 1,
        row.submittedAt]);
      await client.query(`INSERT INTO cooperation_partner_status
        (id, registration_id, status, changed_by, changed_at)
        VALUES ($1, $2, 'lead_received', 'migration:sites-d1', $3)`,
      [randomUUID(), registrationId, row.submittedAt]);
      await client.query(`INSERT INTO cooperation_col_sequence (sequence_year, current_value)
        VALUES ($1, $2)
        ON CONFLICT (sequence_year) DO UPDATE
        SET current_value = GREATEST(cooperation_col_sequence.current_value, EXCLUDED.current_value), updated_at = now()`,
      [Number(match[1]), Number(match[2])]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }
}

async function validate() {
  const result = await client.query(`SELECT
    (SELECT count(*)::int FROM cooperation_registration) AS registrations,
    (SELECT count(*)::int FROM cooperation_organization) AS organizations,
    (SELECT count(*)::int FROM cooperation_partner_status) AS statuses,
    (SELECT count(*)::int FROM cooperation_registration r LEFT JOIN cooperation_organization o ON o.id = r.organization_id WHERE o.id IS NULL) AS orphans,
    (SELECT count(*)::int FROM (SELECT lead_number FROM cooperation_registration GROUP BY lead_number HAVING count(*) > 1) d) AS duplicates,
    (SELECT current_value::int FROM cooperation_col_sequence WHERE sequence_year = 2026) AS sequence_2026`);
  return result.rows[0];
}

async function exportBackup() {
  const backup = {};
  for (const table of tables) {
    const result = await client.query(`SELECT * FROM ${table}`);
    backup[table] = result.rows;
  }
  await fs.writeFile(backupPath, `${JSON.stringify({createdAt: new Date().toISOString(), tables: backup})}\n`, {mode: 0o600});
  return backup;
}

async function restoreBackup(backup) {
  for (const table of tables) {
    for (const row of backup[table] || []) {
      const keys = Object.keys(row);
      const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
      await client.query(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`, keys.map((key) => row[key]));
    }
  }
}

await client.connect();
try {
  await resetCooperationSchema();
  await importHistory(sourceRecords);
  const firstValidation = await validate();
  const backup = await exportBackup();
  await resetCooperationSchema();
  await restoreBackup(backup);
  const secondValidation = await validate();
  const valid = Number(firstValidation.registrations) === sourceRecords.length
    && Number(secondValidation.registrations) === sourceRecords.length
    && Number(firstValidation.orphans) === 0 && Number(secondValidation.orphans) === 0
    && Number(firstValidation.duplicates) === 0 && Number(secondValidation.duplicates) === 0
    && Number(secondValidation.sequence_2026) === 1;
  const report = {
    sourceCount: sourceRecords.length,
    firstValidation,
    backupTableCounts: Object.fromEntries(tables.map((table) => [table, backup[table].length])),
    secondValidation,
    nextLeadNumber: 'COL-2026-0002',
    valid,
  };
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, {mode: 0o600});
  console.log(JSON.stringify(report));
  if (!valid) process.exitCode = 1;
} finally {
  await client.end();
}
