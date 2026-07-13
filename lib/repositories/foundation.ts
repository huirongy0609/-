import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  FoundationKnowledgeObject,
  FoundationLifecycle,
  FoundationObjectType,
} from '@/lib/domain/foundation';

type FoundationIndexEntry = {
  id: string;
  title: string;
  version: string | null;
  version_note: string | null;
  lifecycle_status: FoundationLifecycle | null;
  source_audit_status: string | null;
  file_path: string | null;
  object_type: string;
  approved_at: string | null;
  related_objects: Array<{id: string; lifecycle_status: FoundationLifecycle | null}>;
};

type FoundationIndex = {
  generated_at: string;
  objects: FoundationIndexEntry[];
};

const foundationIndexPath = path.join(process.cwd(), 'knowledge', 'foundation', 'index.json');

export async function getFoundationKnowledgeObjects(): Promise<FoundationKnowledgeObject[]> {
  const index = await readFoundationIndex();
  const entries = index.objects.filter((entry) => entry.object_type === 'JD' || entry.object_type === 'GT');
  const objects = await Promise.all(entries.map(toKnowledgeObject));

  return objects.sort((a, b) => {
    const lifecycleOrder = lifecycleRank(a.lifecycleStatus) - lifecycleRank(b.lifecycleStatus);
    if (lifecycleOrder !== 0) return lifecycleOrder;
    return a.id.localeCompare(b.id, 'en', {numeric: true});
  });
}

export async function getFoundationKnowledgeObject(id: string): Promise<FoundationKnowledgeObject | undefined> {
  const objects = await getFoundationKnowledgeObjects();
  return objects.find((item) => item.id.toLowerCase() === id.toLowerCase());
}

export async function searchFoundationKnowledgeObjects(params: {
  query?: string;
  type?: FoundationObjectType | 'All';
  category?: string;
  status?: FoundationLifecycle | 'All';
}): Promise<FoundationKnowledgeObject[]> {
  const query = params.query?.trim().toLowerCase();
  const objects = await getFoundationKnowledgeObjects();

  return objects.filter((item) => {
    const matchesType = !params.type || params.type === 'All' || item.type === params.type;
    const matchesCategory = !params.category || params.category === 'All' || item.category === params.category;
    const matchesStatus = !params.status || params.status === 'All' || item.lifecycleStatus === params.status;
    const haystack = [item.id, item.title, item.summary, item.body, item.category, ...item.tags].join(' ').toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesType && matchesCategory && matchesStatus && matchesQuery;
  });
}

export async function getFoundationCategories(): Promise<string[]> {
  const objects = await getFoundationKnowledgeObjects();
  return Array.from(new Set(objects.map((item) => item.category))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

async function readFoundationIndex(): Promise<FoundationIndex> {
  const source = await fs.readFile(foundationIndexPath, 'utf8');
  const parsed = JSON.parse(source) as FoundationIndex;
  if (!Array.isArray(parsed.objects)) throw new Error('Foundation index is missing objects');
  return parsed;
}

async function toKnowledgeObject(entry: FoundationIndexEntry): Promise<FoundationKnowledgeObject> {
  const type = entry.object_type as FoundationObjectType;
  const body = entry.file_path ? await readRegisteredFile(entry.file_path) : '';

  return {
    id: entry.id,
    type,
    title: entry.title,
    summary: extractSummary(body) || `${entry.title}尚未形成可读取的正文摘要。`,
    body,
    category: classifyObject(entry.id, type),
    tags: deriveTags(entry.title, body, type),
    version: entry.version,
    versionNote: entry.version_note,
    lifecycleStatus: entry.lifecycle_status,
    sourceAuditStatus: entry.source_audit_status,
    filePath: entry.file_path,
    approvedAt: entry.approved_at,
    relatedObjects: (entry.related_objects || []).map((relation) => ({
      id: relation.id,
      lifecycleStatus: relation.lifecycle_status,
    })),
  };
}

async function readRegisteredFile(filePath: string): Promise<string> {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const repositoryRoot = `${path.resolve(process.cwd())}${path.sep}`;
  if (!absolutePath.startsWith(repositoryRoot)) throw new Error(`Foundation path escapes repository: ${filePath}`);
  return fs.readFile(absolutePath, 'utf8');
}

function extractSummary(body: string): string {
  const lines = body.split(/\r?\n/).map((line) => line.trim());
  const definitionHeading = lines.findIndex((line) => /定义/.test(line) && line.length < 36);
  const searchOrder = definitionHeading >= 0 ? [...lines.slice(definitionHeading + 1), ...lines.slice(0, definitionHeading)] : lines;

  const candidate = searchOrder.find((line) => {
    if (line.length < 18) return false;
    if (/^(#|---|[-*]\s|\d+[.、]|[一二三四五六七八九十]+、)/.test(line)) return false;
    if (/^(版本|维护机构|状态|——引自)/.test(line)) return false;
    if (/[：:]$/.test(line)) return false;
    return true;
  });

  if (!candidate) return '';
  return candidate.length > 180 ? `${candidate.slice(0, 178)}…` : candidate;
}

function classifyObject(id: string, type: FoundationObjectType): string {
  if (type === 'GT') return '治理工具';
  const numericId = Number(id.replace(/\D/g, ''));
  if (numericId >= 1 && numericId <= 5) return '信托与制度';
  if (numericId >= 6 && numericId <= 7) return '治理主体';
  if (numericId >= 8) return '资金治理';
  return '治理词典';
}

function deriveTags(title: string, body: string, type: FoundationObjectType): string[] {
  const source = `${title}\n${body}`;
  const vocabulary = ['信托制物业', '信托', '信义义务', '受托关系', '委托人', '受托人', '业主共同基金', '预算治理', '社区治理'];
  const tags = vocabulary.filter((term) => source.includes(term));
  return [type === 'JD' ? '治理词典' : '治理工具', ...tags].slice(0, 5);
}

function lifecycleRank(status: FoundationLifecycle | null): number {
  if (status === 'approved') return 0;
  if (status === 'in_review') return 1;
  if (status === 'draft') return 2;
  if (status === 'pending_revision') return 3;
  if (status === 'archived') return 4;
  return 5;
}
