import assert from 'node:assert/strict';
import test from 'node:test';
import {cooperationDatabaseConnectionString} from '../lib/cooperation/database-config.ts';

test('candidate database connection supports isolated secret fields', () => {
  const value = cooperationDatabaseConnectionString({
    COOPERATION_DATABASE_HOST: 'pgm-candidate.pg.rds.aliyuncs.com',
    COOPERATION_DATABASE_PORT: '5432',
    COOPERATION_DATABASE_NAME: 'trust_property',
    COOPERATION_DATABASE_USER: 'trust_app',
    COOPERATION_DATABASE_PASSWORD: 'secret@value:/with spaces',
  });
  const url = new URL(value);
  assert.equal(url.hostname, 'pgm-candidate.pg.rds.aliyuncs.com');
  assert.equal(url.pathname, '/trust_property');
  assert.equal(decodeURIComponent(url.username), 'trust_app');
  assert.equal(decodeURIComponent(url.password), 'secret@value:/with spaces');
});

test('direct cooperation database URL remains backward compatible', () => {
  assert.equal(cooperationDatabaseConnectionString({
    COOPERATION_DATABASE_URL: 'postgresql://legacy:secret@legacy.internal:5432/database',
  }), 'postgresql://legacy:secret@legacy.internal:5432/database');
});
