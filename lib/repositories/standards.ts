import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';

export type PlatformStandard = {
  slug: string;
  title: string;
  version: string;
  status: string;
  type: string;
  summary: string;
  body: string;
  filePath: string;
};

const standardsDirectory = path.join(process.cwd(), 'docs', 'standards');

export async function getPlatformStandards(): Promise<PlatformStandard[]> {
  const entries = await fs.readdir(standardsDirectory, {withFileTypes: true});
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name.toLowerCase() !== 'readme.md')
    .map((entry) => entry.name);
  const standards = await Promise.all(files.map(readStandard));
  return standards.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
}

export async function getPlatformStandard(slug: string): Promise<PlatformStandard | undefined> {
  const standards = await getPlatformStandards();
  return standards.find((standard) => standard.slug === slug);
}

async function readStandard(fileName: string): Promise<PlatformStandard> {
  const filePath = path.join(standardsDirectory, fileName);
  const source = await fs.readFile(filePath, 'utf8');
  const title = source.match(/^#\s+(.+)$/m)?.[1]?.trim() || fileName.replace(/\.md$/, '');
  const version = readMetadata(source, '版本') || title.match(/V\d+(?:\.\d+)?/i)?.[0] || '版本未标注';
  const status = normalizeStatus(readMetadata(source, '状态'));
  const type = readMetadata(source, '文件类型') || 'Platform Standard';

  return {
    slug: fileName.replace(/\.md$/, ''),
    title,
    version,
    status,
    type,
    summary: extractStandardSummary(source),
    body: stripLeadingMetadata(source),
    filePath: `docs/standards/${fileName}`,
  };
}

function readMetadata(source: string, label: string): string | undefined {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`^>\\s*(?:\\*\\*)?${escaped}(?:\\*\\*)?[：:]\\s*(.+)$`, 'm'));
  return match?.[1]?.replace(/\*\*/g, '').trim();
}

function normalizeStatus(value?: string): string {
  if (!value) return 'status_not_declared';
  const normalized = value.replace(/`/g, '').toLowerCase();
  if (normalized.includes('in_review') || normalized.includes('审核')) return 'in_review';
  if (normalized.includes('approved') || normalized.includes('批准')) return 'approved';
  if (normalized.includes('pending_revision')) return 'pending_revision';
  if (normalized.includes('archived')) return 'archived';
  return normalized;
}

function extractStandardSummary(source: string): string {
  const withoutMetadata = stripLeadingMetadata(source);
  const lines = withoutMetadata.split(/\r?\n/).map((line) => line.trim());
  const candidate = lines.find((line) => line.length >= 24 && !/^(#|---|[-*]\s|\|)/.test(line));
  if (!candidate) return '平台标准正文。';
  return candidate.length > 180 ? `${candidate.slice(0, 178)}…` : candidate;
}

function stripLeadingMetadata(source: string): string {
  const lines = source.split(/\r?\n/);
  let index = lines[0]?.startsWith('# ') ? 1 : 0;
  while (index < lines.length && (lines[index].trim() === '' || lines[index].trim().startsWith('>'))) index += 1;
  if (lines[index]?.trim() === '---') index += 1;
  return lines.slice(index).join('\n').trim();
}
