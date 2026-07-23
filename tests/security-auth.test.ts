import assert from 'node:assert/strict';
import test from 'node:test';

import {areKnowledgeWritesEnabled, isAdminRequestAuthorized} from '../lib/security/admin-auth.ts';

const variables = ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'KNOWLEDGE_WRITES_ENABLED'] as const;

test('fails closed when administrator credentials are missing', () => {
  withEnvironment({}, () => {
    assert.equal(isAdminRequestAuthorized(request()), false);
  });
});

test('rejects missing and invalid authorization headers', () => {
  withEnvironment({ADMIN_USERNAME: 'operator', ADMIN_PASSWORD: 'a-secure-test-password'}, () => {
    assert.equal(isAdminRequestAuthorized(request()), false);
    assert.equal(isAdminRequestAuthorized(request('Basic invalid-base64')), false);
    assert.equal(isAdminRequestAuthorized(request(basic('operator', 'wrong-password'))), false);
  });
});

test('accepts the configured administrator credentials', () => {
  withEnvironment({ADMIN_USERNAME: 'operator', ADMIN_PASSWORD: 'a-secure-test-password'}, () => {
    assert.equal(isAdminRequestAuthorized(request(basic('operator', 'a-secure-test-password'))), true);
  });
});

test('keeps knowledge writes disabled unless explicitly enabled', () => {
  withEnvironment({}, () => assert.equal(areKnowledgeWritesEnabled(), false));
  withEnvironment({KNOWLEDGE_WRITES_ENABLED: 'true'}, () => assert.equal(areKnowledgeWritesEnabled(), true));
});

function request(authorization?: string): Pick<Request, 'headers'> {
  return {headers: new Headers(authorization ? {authorization} : {})};
}

function basic(username: string, password: string): string {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

function withEnvironment(values: Partial<Record<(typeof variables)[number], string>>, run: () => void): void {
  const environment = process.env as Record<string, string | undefined>;
  const original = Object.fromEntries(variables.map((name) => [name, environment[name]]));
  try {
    for (const name of variables) {
      const value = values[name];
      if (value === undefined) delete environment[name];
      else environment[name] = value;
    }
    run();
  } finally {
    for (const name of variables) {
      const value = original[name];
      if (value === undefined) delete environment[name];
      else environment[name] = value;
    }
  }
}
