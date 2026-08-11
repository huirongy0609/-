const required = [
  'NEXT_PUBLIC_SITE_URL',
  'COOPERATION_OIDC_ISSUER',
  'COOPERATION_OIDC_CLIENT_ID',
  'COOPERATION_OIDC_CLIENT_SECRET',
  'COOPERATION_OIDC_AUTHORIZATION_ENDPOINT',
  'COOPERATION_OIDC_TOKEN_ENDPOINT',
  'COOPERATION_OIDC_JWKS_URI',
  'COOPERATION_OIDC_MFA_ACR_VALUES',
];

const errors = [];
for (const name of required) {
  const value = process.env[name]?.trim() || '';
  if (!value) errors.push(`${name}:missing`);
  if (/^(change-me|example|placeholder|todo|tbd)$/i.test(value)) errors.push(`${name}:placeholder`);
}

if (process.env.COOPERATION_IDENTITY_PROVIDER !== 'oidc') errors.push('COOPERATION_IDENTITY_PROVIDER:must_be_oidc');
if (process.env.COOPERATION_DATABASE_SSL === 'disable') errors.push('COOPERATION_DATABASE_SSL:must_verify_tls');

for (const name of ['NEXT_PUBLIC_SITE_URL', 'COOPERATION_OIDC_ISSUER',
  'COOPERATION_OIDC_AUTHORIZATION_ENDPOINT', 'COOPERATION_OIDC_TOKEN_ENDPOINT', 'COOPERATION_OIDC_JWKS_URI']) {
  const value = process.env[name]?.trim();
  if (value && !value.startsWith('https://')) errors.push(`${name}:must_use_https`);
}

const databaseUrl = process.env.COOPERATION_DATABASE_URL?.trim() || '';
const databaseHost = process.env.COOPERATION_DATABASE_HOST?.trim() || '';
if (!databaseUrl) {
  for (const name of ['COOPERATION_DATABASE_HOST', 'COOPERATION_DATABASE_NAME',
    'COOPERATION_DATABASE_USER', 'COOPERATION_DATABASE_PASSWORD']) {
    if (!process.env[name]?.trim()) errors.push(`${name}:missing`);
  }
}
if (databaseUrl && !/^postgres(ql)?:\/\//.test(databaseUrl)) errors.push('COOPERATION_DATABASE_URL:invalid_scheme');
if (databaseUrl && /(localhost|127\.0\.0\.1|supabase)/i.test(databaseUrl)) errors.push('COOPERATION_DATABASE_URL:not_domestic_candidate');
if (databaseHost && /(localhost|127\.0\.0\.1|supabase)/i.test(databaseHost)) errors.push('COOPERATION_DATABASE_HOST:not_domestic_candidate');

if (errors.length) {
  console.error(`FAIL Production Candidate environment: ${errors.join(', ')}`);
  process.exit(1);
}

console.log('PASS Production Candidate environment variables satisfy the static isolation policy.');
