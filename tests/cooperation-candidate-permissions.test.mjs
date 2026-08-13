import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const grants = await readFile(
  new URL('../db/cooperation/002_runtime_grants.sql', import.meta.url),
  'utf8',
);
const compose = await readFile(
  new URL('../deploy/alicloud/production-candidate/docker-compose.yml', import.meta.url),
  'utf8',
);
const dockerfile = await readFile(new URL('../Dockerfile', import.meta.url), 'utf8');
const database = await readFile(
  new URL('../lib/cooperation/database.ts', import.meta.url),
  'utf8',
);
const adminAuth = await readFile(
  new URL('../lib/cooperation/admin-auth.ts', import.meta.url),
  'utf8',
);
const oidcCallback = await readFile(
  new URL('../app/api/cooperation-auth/oidc/callback/route.ts', import.meta.url),
  'utf8',
);

test('runtime grants permit business access but keep audit reads isolated', () => {
  assert.match(grants, /GRANT SELECT, INSERT\s+ON TABLE cooperation_registration/);
  assert.match(grants, /GRANT INSERT\s+ON TABLE cooperation_audit_log/);
  assert.doesNotMatch(grants, /GRANT[^;]*SELECT[^;]*cooperation_audit_log/);
});

test('candidate migration receives the separately configured runtime role', () => {
  assert.match(
    compose,
    /COOPERATION_RUNTIME_DATABASE_USER: \$\{COOPERATION_DATABASE_USER:\?set COOPERATION_DATABASE_USER\}/,
  );
  assert.match(dockerfile, /002_runtime_grants\.sql/);
});

test('readiness checks real tables and append-only audit privileges', () => {
  assert.match(database, /to_regclass\('public\.cooperation_registration'\)/);
  assert.match(database, /cooperation_audit_log', 'INSERT'/);
  assert.match(database, /NOT has_table_privilege\([\s\S]*cooperation_audit_log', 'SELECT'/);
});

test('OIDC requests without a session create a denied audit record', () => {
  const missingSessionBranch = adminAuth.match(
    /if \(!user\) \{([\s\S]*?)return \{status: 'unauthorized', reason: 'session_missing_or_invalid'\};/,
  )?.[1] || '';
  assert.match(missingSessionBranch, /await safeAudit/);
  assert.match(missingSessionBranch, /actorSubject: 'anonymous'/);
  assert.match(missingSessionBranch, /outcome: 'denied'/);
});

test('OIDC callback redirects use the configured public application origin', () => {
  assert.match(oidcCallback, /oidcApplicationUrl\('\/cooperation\/admin\/login'\)/);
  assert.match(oidcCallback, /oidcApplicationUrl\('\/cooperation\/admin'\)/);
  assert.doesNotMatch(oidcCallback, /new URL\('\/cooperation\/admin[^']*', request\.url\)/);
});

test('OIDC callback failures are recorded without unverified subject data', () => {
  assert.match(oidcCallback, /actorSubject: 'anonymous'/);
  assert.match(oidcCallback, /outcome: 'denied'/);
  assert.match(oidcCallback, /await auditDenied\('authentication_failed'\)/);
});
