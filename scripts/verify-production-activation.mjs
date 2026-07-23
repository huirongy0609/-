#!/usr/bin/env node

import {resolve4, resolveCname} from 'node:dns/promises';

const options = parseArguments(process.argv.slice(2));
const target = new URL(options.target || 'https://xintuozhiwuye.com');
const expectedOrigin = new URL(options.expectedOrigin || target.origin).origin;
const primaryHost = target.hostname;
const aliases = options.aliases
  ? options.aliases.split(',').map((value) => value.trim()).filter(Boolean)
  : [
      `www.${primaryHost}`,
      'xintuozhiwuye.cn',
      'www.xintuozhiwuye.cn',
      'xintuozhiwuye.net',
      'www.xintuozhiwuye.net',
    ];

let failures = 0;
let warnings = 0;
let checks = 0;

await checkDns();
await checkPublicRoutes();
await checkMetadata('/');
await checkMetadata('/knowledge/jd001');
await checkAccessControl();
if (!options.skipAliases) await checkAliases();

console.log(`\nSUMMARY PASS=${checks - failures - warnings} WARN=${warnings} FAIL=${failures}`);
process.exitCode = failures ? 1 : 0;

async function checkDns() {
  if (options.skipDns) return result('WARN', 'DNS checks skipped by command option.');
  try {
    const addresses = await resolve4(primaryHost);
    result(addresses.length ? 'PASS' : 'FAIL', `${primaryHost} A: ${addresses.join(', ') || 'none'}`);
  } catch (error) {
    result('FAIL', `${primaryHost} A lookup failed: ${message(error)}`);
  }
  for (const alias of aliases.filter((host) => host.startsWith('www.'))) {
    try {
      const records = await resolveCname(alias);
      result(records.length ? 'PASS' : 'WARN', `${alias} CNAME: ${records.join(', ') || 'none'}`);
    } catch (error) {
      result('WARN', `${alias} CNAME lookup unavailable: ${message(error)}`);
    }
  }
}

async function checkPublicRoutes() {
  const expected = new Map([
    ['/', 200],
    ['/knowledge/jd001', 200],
    ['/knowledge/jd003', 200],
    ['/knowledge/jd008', 404],
    ['/knowledge/jd009', 200],
    ['/knowledge/jd010', 404],
    ['/robots.txt', 200],
    ['/sitemap.xml', 200],
    ['/feed.xml', 200],
  ]);
  for (const [pathname, expectedStatus] of expected) {
    const response = await request(pathname);
    result(
      response.status === expectedStatus ? 'PASS' : 'FAIL',
      `${pathname} HTTP ${response.status}; expected ${expectedStatus}`,
    );
    if (pathname === '/robots.txt' && response.ok) {
      const body = await response.text();
      for (const crawler of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot']) {
        result(body.includes(crawler) ? 'PASS' : 'FAIL', `robots.txt declares ${crawler}`);
      }
    }
    if ((pathname === '/sitemap.xml' || pathname === '/feed.xml') && response.ok) {
      const body = await response.text();
      result(body.includes(expectedOrigin) ? 'PASS' : 'FAIL', `${pathname} uses ${expectedOrigin}`);
      result(!body.includes('/admin') && !body.includes('status=Draft'), 'FAIL', `${pathname} excludes private/draft entries`);
    }
  }
}

async function checkMetadata(pathname) {
  const response = await request(pathname);
  if (!response.ok) return result('FAIL', `${pathname} metadata unavailable because HTTP ${response.status}`);
  const html = await response.text();
  const expectedCanonical = `${expectedOrigin}${pathname === '/' ? '' : pathname}`;
  const canonical = attribute(html, 'link', 'rel', 'canonical', 'href');
  const openGraphUrl = attribute(html, 'meta', 'property', 'og:url', 'content');
  const title = tagText(html, 'title');
  const description = attribute(html, 'meta', 'name', 'description', 'content');

  result(Boolean(title && title.includes('信托制物业')), 'FAIL', `${pathname} title contains 信托制物业`);
  result(Boolean(description && description.length >= 20), 'FAIL', `${pathname} description is present and substantive`);
  if (pathname === '/') {
    result(description.includes('信托制物业'), 'FAIL', `${pathname} description contains 信托制物业`);
  }
  result(canonical === expectedCanonical, 'FAIL', `${pathname} canonical: ${canonical || 'missing'}`);
  result(openGraphUrl === expectedCanonical, 'FAIL', `${pathname} OpenGraph URL: ${openGraphUrl || 'missing'}`);
  result(Boolean(attribute(html, 'meta', 'name', 'twitter:card', 'content')), 'FAIL', `${pathname} Twitter Card present`);

  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  result(jsonLdBlocks.length > 0, 'FAIL', `${pathname} JSON-LD present`);
  const metadataSurface = [canonical, openGraphUrl, ...jsonLdBlocks.map((match) => match[1])].join('\n');
  const forbidden = expectedOrigin.includes('xintuozhiwuye.com')
    ? ['judao.club', 'vercel.app', 'github.io']
    : ['dev.judao.club', 'geo.judao.org', 'github.io'];
  for (const value of forbidden) {
    result(!metadataSurface.includes(value), 'FAIL', `${pathname} metadata excludes ${value}`);
  }
  for (const [header, expected] of [
    ['content-security-policy', 'frame-ancestors'],
    ['strict-transport-security', 'max-age='],
    ['x-content-type-options', 'nosniff'],
    ['referrer-policy', 'strict-origin-when-cross-origin'],
    ['permissions-policy', 'camera=()'],
    ['x-frame-options', 'DENY'],
  ]) {
    result(response.headers.get(header)?.includes(expected), 'FAIL', `${pathname} ${header}`);
  }
}

async function checkAccessControl() {
  for (const pathname of ['/admin', '/admin/knowledge', '/api/knowledge-objects']) {
    const response = await request(pathname);
    result(response.status === 401, 'FAIL', `${pathname} unauthenticated HTTP ${response.status}; expected 401`);
  }
  const write = await request('/api/knowledge-objects', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{}'});
  result(write.status === 401, 'FAIL', `/api/knowledge-objects unauthenticated POST HTTP ${write.status}; expected 401`);
}

async function checkAliases() {
  for (const host of aliases) {
    try {
      const response = await fetch(`https://${host}/`, {redirect: 'manual', signal: AbortSignal.timeout(15000)});
      const location = response.headers.get('location');
      result(
        response.status === 301 && location?.startsWith(expectedOrigin),
        'FAIL',
        `${host} permanent redirect: HTTP ${response.status} → ${location || 'missing'}`,
      );
    } catch (error) {
      result('FAIL', `${host} HTTPS/redirect failed: ${message(error)}`);
    }
  }
}

async function request(pathname, init = {}) {
  try {
    return await fetch(new URL(pathname, target), {
      ...init,
      redirect: 'manual',
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    result('FAIL', `${pathname} request failed: ${message(error)}`);
    return new Response(null, {status: 599});
  }
}

function result(conditionOrStatus, failureStatusOrMessage, maybeMessage) {
  const status = typeof conditionOrStatus === 'boolean'
    ? (conditionOrStatus ? 'PASS' : failureStatusOrMessage)
    : conditionOrStatus;
  const text = typeof conditionOrStatus === 'boolean' ? maybeMessage : failureStatusOrMessage;
  checks += 1;
  if (status === 'FAIL') failures += 1;
  if (status === 'WARN') warnings += 1;
  console.log(`${status.padEnd(4)} ${text}`);
}

function attribute(html, tag, key, keyValue, valueKey) {
  const tags = html.match(new RegExp(`<${tag}\\b[^>]*>`, 'gi')) || [];
  const match = tags.find((value) => new RegExp(`${key}=["']${escapeRegex(keyValue)}["']`, 'i').test(value));
  return match?.match(new RegExp(`${valueKey}=["']([^"']+)["']`, 'i'))?.[1] || null;
}

function tagText(html, tag) {
  return html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1]?.trim() || null;
}

function parseArguments(args) {
  const values = {};
  for (let index = 0; index < args.length; index += 1) {
    const key = args[index];
    if (!key.startsWith('--')) continue;
    const name = key.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (name.startsWith('skip')) values[name] = true;
    else values[name] = args[index + 1], index += 1;
  }
  return values;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function message(error) {
  return error instanceof Error ? error.message : String(error);
}
