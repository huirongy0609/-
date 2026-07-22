import assert from 'node:assert/strict';
import test from 'node:test';

import {getSiteUrl} from '../lib/geo/site.ts';

const managedVariables = ['NEXT_PUBLIC_SITE_URL', 'NODE_ENV', 'VERCEL_ENV', 'VERCEL_URL'] as const;

test('uses the configured site URL and removes its trailing slash', () => {
  withEnvironment({NEXT_PUBLIC_SITE_URL: 'https://staging.example.com/'}, () => {
    assert.equal(getSiteUrl(), 'https://staging.example.com');
  });
});

test('uses the official domain when production has no explicit site URL', () => {
  withEnvironment({NODE_ENV: 'production'}, () => {
    assert.equal(getSiteUrl(), 'https://judao.club');
  });
});

test('uses the Vercel preview URL without contaminating production metadata', () => {
  withEnvironment({NODE_ENV: 'production', VERCEL_ENV: 'preview', VERCEL_URL: 'example-preview.vercel.app'}, () => {
    assert.equal(getSiteUrl(), 'https://example-preview.vercel.app');
  });
});

test('uses localhost outside production when no URL is configured', () => {
  withEnvironment({NODE_ENV: 'development'}, () => {
    assert.equal(getSiteUrl(), 'http://localhost:3000');
  });
});

test('rejects an invalid explicitly configured URL', () => {
  withEnvironment({NEXT_PUBLIC_SITE_URL: 'not a valid host'}, () => {
    assert.throws(() => getSiteUrl(), /NEXT_PUBLIC_SITE_URL must be a valid HTTP\(S\) URL/);
  });
});

function withEnvironment(values: Partial<Record<(typeof managedVariables)[number], string>>, run: () => void): void {
  const environment = process.env as Record<string, string | undefined>;
  const original = Object.fromEntries(managedVariables.map((name) => [name, environment[name]]));

  try {
    for (const name of managedVariables) {
      const value = values[name];
      if (value === undefined) delete environment[name];
      else environment[name] = value;
    }
    run();
  } finally {
    for (const name of managedVariables) {
      const value = original[name];
      if (value === undefined) delete environment[name];
      else environment[name] = value;
    }
  }
}
