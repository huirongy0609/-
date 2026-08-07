import {createHash, randomBytes} from 'node:crypto';
import type {JWTPayload} from 'jose';

export function randomUrlSafe(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

export function pkceChallenge(verifier: string) {
  return createHash('sha256').update(verifier).digest('base64url');
}

export function oidcPayloadHasMfa(payload: JWTPayload, acceptedAcrValues: string[]) {
  if (typeof payload.acr === 'string' && acceptedAcrValues.includes(payload.acr)) return true;
  const methods = Array.isArray(payload.amr) ? payload.amr.filter((value): value is string => typeof value === 'string') : [];
  return methods.some((value) => ['mfa', 'otp', 'totp'].includes(value.toLowerCase()));
}
