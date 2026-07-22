import {access, readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'app/knowledge/[id]/page.tsx',
  'app/standards/[slug]/page.tsx',
  'app/faq/[id]/page.tsx',
  'app/articles/[id]/page.tsx',
  'app/sitemap.ts',
  'app/robots.ts',
  'app/feed.xml/route.ts',
  'public/brand/judao-logo-seal.png',
  'lib/geo/metadata.ts',
  'lib/geo/publication.ts',
];

const checks = [];
for (const file of requiredFiles) {
  checks.push(await exists(file)
    ? {status: 'PASS', check: `存在 ${file}`}
    : {status: 'FAIL', check: `缺少 ${file}`});
}

const metadataSource = await readFile(resolve(root, 'lib/geo/metadata.ts'), 'utf8');
for (const token of ['alternates', 'canonical', 'openGraph', 'twitter', 'application/ld+json']) {
  const haystack = token === 'application/ld+json'
    ? await readFile(resolve(root, 'components/geo/JsonLd.tsx'), 'utf8')
    : metadataSource;
  checks.push({status: haystack.includes(token) ? 'PASS' : 'FAIL', check: `统一输出 ${token}`});
}

const robotsSource = await readFile(resolve(root, 'app/robots.ts'), 'utf8');
for (const crawler of ['Googlebot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot']) {
  checks.push({status: robotsSource.includes(crawler) ? 'PASS' : 'FAIL', check: `robots 声明 ${crawler}`});
}

const siteSource = await readFile(resolve(root, 'lib/geo/site.ts'), 'utf8');
checks.push({
  status: !siteSource.includes('dev.judao.club') && siteSource.includes('https://judao.club') ? 'PASS' : 'FAIL',
  check: '生产 Site URL 不回退 dev 域名',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
checks.push({
  status: /^https:\/\/[^/]+/.test(siteUrl) ? 'PASS' : 'WARN',
  check: siteUrl ? `生产站点 URL：${siteUrl}` : '未在当前检查环境显式设置 NEXT_PUBLIC_SITE_URL',
});

for (const result of checks) console.log(`${result.status.padEnd(4)} ${result.check}`);
const failures = checks.filter((result) => result.status === 'FAIL');
console.log(`\n${checks.length - failures.length}/${checks.length} 项未发现阻断问题。`);
if (failures.length) process.exitCode = 1;

async function exists(file) {
  try {
    await access(resolve(root, file));
    return true;
  } catch {
    return false;
  }
}
