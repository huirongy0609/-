import assert from 'node:assert/strict';
import test from 'node:test';
import {oidcPayloadHasMfa, pkceChallenge} from '../lib/cooperation/oidc-utils.ts';

test('OIDC candidate requires an approved MFA claim', () => {
  assert.equal(oidcPayloadHasMfa({amr: ['pwd']}, []), false);
  assert.equal(oidcPayloadHasMfa({amr: ['pwd', 'totp']}, []), true);
  assert.equal(oidcPayloadHasMfa({acr: 'urn:example:aal2'}, ['urn:example:aal2']), true);
  assert.equal(oidcPayloadHasMfa({acr: 'urn:example:aal1'}, ['urn:example:aal2']), false);
});

test('PKCE challenge is deterministic and URL safe', () => {
  const challenge = pkceChallenge('candidate-verifier-value');
  assert.match(challenge, /^[A-Za-z0-9_-]+$/);
  assert.equal(challenge, pkceChallenge('candidate-verifier-value'));
});
