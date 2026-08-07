import fs from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';

const schema = await fs.readFile(new URL('../../db/cooperation/001_initial.sql', import.meta.url), 'utf8');
const db = new PGlite();

await db.exec(schema);
const organizationId = randomUUID();
const registrationId = randomUUID();
const auditId = randomUUID();
await db.query(`INSERT INTO cooperation_organization (id, name, city, partner_type)
  VALUES ($1, '候选环境测试机构', '测试城市', 'other')`, [organizationId]);
const sequence = await db.query(`INSERT INTO cooperation_col_sequence (sequence_year, current_value)
  VALUES (2099, 1)
  ON CONFLICT (sequence_year) DO UPDATE SET current_value = cooperation_col_sequence.current_value + 1
  RETURNING current_value`);
const leadNumber = `COL-2099-${String(sequence.rows[0].current_value).padStart(4, '0')}`;
await db.query(`INSERT INTO cooperation_registration
  (id, lead_number, organization_id, contact_name, phone, cooperation_directions,
   current_status, source_page, consent_data_use, submitted_at)
  VALUES ($1, $2, $3, '测试联系人', '13800000000', ARRAY['content_co_creation'],
    'seeking_cooperation', '/candidate-validation', true, now())`,
[registrationId, leadNumber, organizationId]);
await db.query(`INSERT INTO cooperation_partner_status (id, registration_id, status, changed_by)
  VALUES ($1, $2, 'lead_received', 'test:candidate-validation')`, [randomUUID(), registrationId]);
await db.query(`INSERT INTO cooperation_audit_log
  (id, actor_subject, actor_role, action, resource_type, outcome)
  VALUES ($1, 'test-subject', 'super_admin', 'candidate.validate', 'cooperation', 'success')`, [auditId]);

let auditImmutable = false;
try {
  await db.query('DELETE FROM cooperation_audit_log WHERE id = $1', [auditId]);
} catch {
  auditImmutable = true;
}

const validation = await db.query(`SELECT
  (SELECT count(*)::int FROM cooperation_registration) AS registrations,
  (SELECT count(*)::int FROM cooperation_organization) AS organizations,
  (SELECT count(*)::int FROM cooperation_partner_status) AS statuses,
  (SELECT count(*)::int FROM cooperation_registration r LEFT JOIN cooperation_organization o ON o.id = r.organization_id WHERE o.id IS NULL) AS orphans,
  (SELECT count(*)::int FROM (SELECT lead_number FROM cooperation_registration GROUP BY lead_number HAVING count(*) > 1) d) AS duplicate_cols`);
const row = validation.rows[0];
const valid = Number(row.registrations) === 1
  && Number(row.organizations) === 1
  && Number(row.statuses) === 1
  && Number(row.orphans) === 0
  && Number(row.duplicate_cols) === 0
  && leadNumber === 'COL-2099-0001'
  && auditImmutable;

console.log(JSON.stringify({schemaTables: 6, syntheticRecords: 1, leadNumber, auditImmutable, ...row, valid}));
await db.close();
if (!valid) process.exitCode = 1;
