const required = ['ADMIN_USERNAME', 'ADMIN_PASSWORD'];
const missing = required.filter((name) => !process.env[name]?.trim());
const password = process.env.ADMIN_PASSWORD || '';

if (missing.length) {
  console.error(`FAIL Missing required production environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
if (password.length < 16) {
  console.error('FAIL ADMIN_PASSWORD must contain at least 16 characters.');
  process.exit(1);
}
console.log('PASS Production authentication environment is configured.');
