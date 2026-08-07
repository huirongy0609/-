import {randomUUID} from 'node:crypto';
import {Pool, type PoolClient} from 'pg';
import type {CooperationLeadInput} from './schema';

export type CooperationLeadRecord = Omit<CooperationLeadInput, 'websiteConfirmation'> & {
  id: string;
  leadNumber: string;
  sourcePage: string;
  submittedAt: string;
};

let pool: Pool | undefined;

function databasePool() {
  const connectionString = process.env.COOPERATION_DATABASE_URL?.trim();
  if (!connectionString) throw new Error('COOPERATION_DATABASE_URL is not configured');
  pool ??= new Pool({
    connectionString,
    max: Number(process.env.COOPERATION_DATABASE_POOL_SIZE || 5),
    ssl: process.env.COOPERATION_DATABASE_SSL === 'disable' ? false : {rejectUnauthorized: true},
  });
  return pool;
}

async function nextLeadNumber(client: PoolClient, year: number) {
  const result = await client.query<{current_value: number}>(`
    INSERT INTO cooperation_col_sequence (sequence_year, current_value)
    VALUES ($1, 1)
    ON CONFLICT (sequence_year) DO UPDATE
      SET current_value = cooperation_col_sequence.current_value + 1,
          updated_at = now()
    RETURNING current_value
  `, [year]);
  return `COL-${year}-${String(result.rows[0].current_value).padStart(4, '0')}`;
}

export async function insertCooperationLead(input: CooperationLeadInput, sourcePage: string) {
  const client = await databasePool().connect();
  try {
    await client.query('BEGIN');
    const now = new Date();
    const organizationId = randomUUID();
    const registrationId = randomUUID();
    const leadNumber = await nextLeadNumber(client, now.getUTCFullYear());
    await client.query(`
      INSERT INTO cooperation_organization
        (id, name, city, website, partner_type)
      VALUES ($1, $2, $3, NULLIF($4, ''), $5)
    `, [organizationId, input.organizationName, input.city, input.organizationWebsite, input.partnerType]);
    await client.query(`
      INSERT INTO cooperation_registration
        (id, lead_number, organization_id, contact_name, phone, wechat, email,
         cooperation_directions, current_status, notes, source_page,
         consent_data_use, submitted_at)
      VALUES ($1, $2, $3, $4, $5, NULLIF($6, ''), NULLIF($7, ''), $8, $9,
              NULLIF($10, ''), $11, $12, $13)
    `, [registrationId, leadNumber, organizationId, input.contactName, input.phone,
      input.wechat, input.email, input.cooperationDirections, input.currentStatus,
      input.notes, sourcePage, input.consentDataUse, now.toISOString()]);
    await client.query(`
      INSERT INTO cooperation_partner_status
        (id, registration_id, status, changed_by)
      VALUES ($1, $2, 'lead_received', 'system:public-registration')
    `, [randomUUID(), registrationId]);
    await client.query('COMMIT');
    return {leadNumber};
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function listCooperationLeads(): Promise<CooperationLeadRecord[]> {
  const result = await databasePool().query(`
    SELECT r.id, r.lead_number, o.name AS organization_name, r.contact_name,
      r.phone, o.city, COALESCE(r.wechat, '') AS wechat,
      COALESCE(r.email, '') AS email, COALESCE(o.website, '') AS organization_website,
      o.partner_type, r.cooperation_directions, r.current_status,
      COALESCE(r.notes, '') AS notes, r.source_page, r.submitted_at,
      r.consent_data_use
    FROM cooperation_registration r
    JOIN cooperation_organization o ON o.id = r.organization_id
    ORDER BY r.submitted_at DESC
  `);
  return result.rows.map((row) => ({
    id: row.id,
    leadNumber: row.lead_number,
    organizationName: row.organization_name,
    contactName: row.contact_name,
    phone: row.phone,
    city: row.city,
    wechat: row.wechat,
    email: row.email,
    organizationWebsite: row.organization_website,
    partnerType: row.partner_type,
    cooperationDirections: row.cooperation_directions,
    currentStatus: row.current_status,
    notes: row.notes,
    sourcePage: row.source_page,
    submittedAt: new Date(row.submitted_at).toISOString(),
    consentDataUse: row.consent_data_use,
  })) as CooperationLeadRecord[];
}

