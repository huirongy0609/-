const requirements = {
  COOPERATION_DATABASE_URL: (value) => /^postgres(ql)?:\/\//.test(value),
  COOPERATION_SESSION_SECRET: (value) => value.length >= 32,
  COOPERATION_ADMIN_LOGIN_URL: (value) => /^https:\/\//.test(value),
};
const invalid = Object.entries(requirements)
  .filter(([name, validate]) => !validate(process.env[name]?.trim() || ''))
  .map(([name]) => name);
if (invalid.length) {
  console.error(`FAIL Staging environment is incomplete: ${invalid.join(', ')}`);
  process.exit(1);
}
console.log('PASS Cooperation staging database and identity configuration are present.');

