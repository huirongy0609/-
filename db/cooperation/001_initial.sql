CREATE TABLE IF NOT EXISTS cooperation_organization (
  id uuid PRIMARY KEY,
  name varchar(120) NOT NULL,
  city varchar(80) NOT NULL,
  website varchar(240),
  partner_type varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cooperation_registration (
  id uuid PRIMARY KEY,
  lead_number varchar(32) NOT NULL UNIQUE,
  organization_id uuid NOT NULL REFERENCES cooperation_organization(id),
  contact_name varchar(40) NOT NULL,
  phone varchar(24) NOT NULL,
  wechat varchar(80),
  email varchar(120),
  cooperation_directions text[] NOT NULL,
  current_status varchar(64) NOT NULL,
  notes varchar(1000),
  source_page varchar(240) NOT NULL,
  consent_data_use boolean NOT NULL,
  submitted_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cooperation_registration_consent CHECK (consent_data_use = true),
  CONSTRAINT cooperation_registration_col CHECK (lead_number ~ '^COL-[0-9]{4}-[0-9]{4,}$')
);

CREATE INDEX IF NOT EXISTS cooperation_registration_submitted_idx
  ON cooperation_registration (submitted_at DESC);

CREATE TABLE IF NOT EXISTS cooperation_partner_status (
  id uuid PRIMARY KEY,
  registration_id uuid NOT NULL REFERENCES cooperation_registration(id),
  status varchar(32) NOT NULL,
  review_result varchar(1000),
  changed_by varchar(160) NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cooperation_partner_status_registration_idx
  ON cooperation_partner_status (registration_id, changed_at DESC);

CREATE TABLE IF NOT EXISTS cooperation_col_sequence (
  sequence_year integer PRIMARY KEY,
  current_value integer NOT NULL CHECK (current_value >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cooperation_admin_user (
  subject_id varchar(160) PRIMARY KEY,
  email varchar(240) NOT NULL UNIQUE,
  role varchar(32) NOT NULL CHECK (role IN ('super_admin', 'cooperation_reviewer', 'data_admin')),
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cooperation_audit_log (
  id uuid PRIMARY KEY,
  actor_subject varchar(160) NOT NULL,
  actor_role varchar(32) NOT NULL,
  action varchar(80) NOT NULL,
  resource_type varchar(80) NOT NULL,
  resource_id varchar(160),
  outcome varchar(16) NOT NULL CHECK (outcome IN ('success', 'denied', 'failure')),
  request_id varchar(160),
  ip_hash varchar(128),
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cooperation_audit_log_occurred_idx
  ON cooperation_audit_log (occurred_at DESC);

CREATE OR REPLACE FUNCTION cooperation_reject_audit_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'cooperation_audit_log is append-only';
END;
$$;

DROP TRIGGER IF EXISTS cooperation_audit_log_immutable ON cooperation_audit_log;
CREATE TRIGGER cooperation_audit_log_immutable
  BEFORE UPDATE OR DELETE ON cooperation_audit_log
  FOR EACH ROW EXECUTE FUNCTION cooperation_reject_audit_mutation();
