import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const sourcePath = argument('--source');
const targetPath = argument('--target');
const reportPath = argument('--report');
const rollbackOnly = process.argv.includes('--rollback-only');

if (!targetPath || (!rollbackOnly && (!sourcePath || !reportPath))) {
  throw new Error('Usage: migrate-history.mjs --source backup.json --target /private/tmp/no029-* --report report.json, or --target ... --rollback-only');
}
if (!path.resolve(targetPath).startsWith('/private/tmp/no029-')) {
  throw new Error('Rehearsal target must be an explicit /private/tmp/no029-* path');
}

const db = new PGlite(targetPath);
const dropSql = `
  DROP TABLE IF EXISTS cooperation_audit_log;
  DROP TABLE IF EXISTS cooperation_admin_user;
  DROP TABLE IF EXISTS cooperation_partner_status;
  DROP TABLE IF EXISTS cooperation_registration;
  DROP TABLE IF EXISTS cooperation_organization;
  DROP TABLE IF EXISTS cooperation_col_sequence;
`;

if (rollbackOnly) {
  await db.exec(dropSql);
  await db.close();
  console.log(JSON.stringify({rollback: 'completed', target: path.basename(targetPath)}));
  process.exit(0);
}

const schemaPath = new URL('../../db/cooperation/001_initial.sql', import.meta.url);
const schema = await fs.readFile(schemaPath, 'utf8');
const backup = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
const records = Array.isArray(backup.records) ? backup.records : [];
const failures = [];
let imported = 0;

await db.exec(schema);
for (const row of records) {
  try {
    const match = /^COL-(\d{4})-(\d{4,})$/.exec(row.leadNumber || '');
    if (!match) throw new Error('invalid_col_number');
    const directions = Array.isArray(row.cooperationDirections)
      ? row.cooperationDirections
      : JSON.parse(row.cooperationDirections || '[]');
    const organizationId = randomUUID();
    const registrationId = randomUUID();
    await db.exec('BEGIN');
    await db.query(`
      INSERT INTO cooperation_organization
        (id, name, city, website, partner_type, created_at, updated_at)
      VALUES ($1, $2, $3, NULLIF($4, ''), $5, $6, $6)
    `, [organizationId, row.organizationName, row.city, row.organizationWebsite || '', row.partnerType, row.submittedAt]);
    await db.query(`
      INSERT INTO cooperation_registration
        (id, lead_number, organization_id, contact_name, phone, wechat, email,
         cooperation_directions, current_status, notes, source_page,
         consent_data_use, submitted_at, created_at)
      VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''), NULLIF($7, ''), $8, $9,
              NULLIF($10, ''), $11, $12, $13, $13)
    `, [registrationId, row.leadNumber, organizationId, row.contactName, row.phone,
      row.wechat || '', row.email || '', directions, row.currentStatus, row.notes || '',
      row.sourcePage || '/cooperation/register', row.consentDataUse === true || row.consentDataUse === 1,
      row.submittedAt]);
    await db.query(`
      INSERT INTO cooperation_partner_status (id, registration_id, status, changed_by, changed_at)
      VALUES ($1, $2, 'lead_received', 'migration:sites-d1', $3)
    `, [randomUUID(), registrationId, row.submittedAt]);
    await db.query(`
      INSERT INTO cooperation_col_sequence (sequence_year, current_value)
      VALUES ($1, $2)
      ON CONFLICT (sequence_year) DO UPDATE
        SET current_value = GREATEST(cooperation_col_sequence.current_value, EXCLUDED.current_value),
            updated_at = now()
    `, [Number(match[1]), Number(match[2])]);
    await db.exec('COMMIT');
    imported += 1;
  } catch (error) {
    await db.exec('ROLLBACK');
    failures.push({leadNumber: row.leadNumber || 'unknown', reason: error instanceof Error ? error.message : 'unknown'});
  }
}

const counts = await db.query(`
  SELECT
    (SELECT count(*)::int FROM cooperation_registration) AS registrations,
    (SELECT count(*)::int FROM cooperation_organization) AS organizations,
    (SELECT count(*)::int FROM cooperation_partner_status) AS statuses,
    (SELECT count(*)::int FROM cooperation_registration r LEFT JOIN cooperation_organization o ON o.id = r.organization_id WHERE o.id IS NULL) AS orphans,
    (SELECT count(*)::int FROM (SELECT lead_number FROM cooperation_registration GROUP BY lead_number HAVING count(*) > 1) duplicate_rows) AS duplicate_numbers
`);
const sequences = await db.query('SELECT sequence_year, current_value FROM cooperation_col_sequence ORDER BY sequence_year');
const nextNumbers = sequences.rows.map((row) => ({
  year: Number(row.sequence_year),
  current: Number(row.current_value),
  next: `COL-${row.sequence_year}-${String(Number(row.current_value) + 1).padStart(4, '0')}`,
}));
const validation = {
  sourceCount: records.length,
  importedCount: imported,
  failedCount: failures.length,
  counts: counts.rows[0],
  sequences: nextNumbers,
  valid: imported === records.length
    && Number(counts.rows[0].registrations) === records.length
    && Number(counts.rows[0].orphans) === 0
    && Number(counts.rows[0].duplicate_numbers) === 0,
};
await fs.writeFile(reportPath, `${JSON.stringify({sourceExportedAt: backup.exportedAt, ...validation, failures}, null, 2)}\n`, {mode: 0o600});
await db.close();
console.log(JSON.stringify(validation));
if (!validation.valid) process.exitCode = 1;

