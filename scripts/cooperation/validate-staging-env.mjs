const databaseUrl = process.env.COOPERATION_DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || '';
const values = {
  POSTGRES_DATABASE_URL: databaseUrl,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
};
const requirements = {
  POSTGRES_DATABASE_URL: (value) => /^postgres(ql)?:\/\//.test(value),
  NEXT_PUBLIC_SUPABASE_URL: (value) => /^https:\/\//.test(value),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: (value) => value.length >= 20,
};
const invalid = Object.entries(requirements).filter(([name, validate]) => !validate(values[name]?.trim() || '')).map(([name]) => name);
if (invalid.length) {
  console.error(`FAIL Staging environment is incomplete: ${invalid.join(', ')}`);
  process.exit(1);
}
console.log('PASS Cooperation staging database and identity configuration are present.');
