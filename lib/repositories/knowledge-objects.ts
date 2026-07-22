import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import {
  createKnowledgeObjectId,
  knowledgeObjectInputSchema,
  knowledgeObjectListSchema,
  type KnowledgeObject,
  type KnowledgeObjectInput,
  type KnowledgeObjectType,
} from '@/lib/domain/knowledge-object';

const knowledgeObjectsPath = path.join(process.cwd(), 'data', 'knowledge-objects.json');

export async function getKnowledgeObjects(): Promise<KnowledgeObject[]> {
  const source = await fs.readFile(knowledgeObjectsPath, 'utf8');
  return knowledgeObjectListSchema.parse(JSON.parse(source)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getKnowledgeObjectById(id: string): Promise<KnowledgeObject | undefined> {
  const items = await getKnowledgeObjects();
  return items.find((item) => item.id === id);
}

export async function getKnowledgeObjectsByType(type: KnowledgeObjectType): Promise<KnowledgeObject[]> {
  const items = await getKnowledgeObjects();
  return items.filter((item) => item.type === type);
}

export async function searchKnowledgeObjects(params: {
  query?: string;
  type?: KnowledgeObjectType | 'All';
  category?: string;
}): Promise<KnowledgeObject[]> {
  const query = params.query?.trim().toLowerCase();
  const items = await getKnowledgeObjects();

  return items.filter((item) => {
    const matchesType = !params.type || params.type === 'All' || item.type === params.type;
    const matchesCategory = !params.category || params.category === 'All' || item.category === params.category;
    const haystack = [item.title, item.summary, item.category, item.type, item.tags.join(' '), item.body].join(' ').toLowerCase();
    const matchesQuery = !query || haystack.includes(query);

    return matchesType && matchesCategory && matchesQuery;
  });
}

export async function createKnowledgeObject(input: KnowledgeObjectInput): Promise<KnowledgeObject> {
  const parsed = knowledgeObjectInputSchema.parse(input);
  const now = new Date().toISOString();
  const items = await getKnowledgeObjects();
  const candidateId = parsed.id?.trim() || createKnowledgeObjectId(parsed.type, parsed.title);
  const id = ensureUniqueId(candidateId, items);
  const next: KnowledgeObject = {
    ...parsed,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await writeKnowledgeObjects([next, ...items]);
  return next;
}

export async function updateKnowledgeObject(id: string, input: KnowledgeObjectInput): Promise<KnowledgeObject | undefined> {
  const parsed = knowledgeObjectInputSchema.parse(input);
  const items = await getKnowledgeObjects();
  const current = items.find((item) => item.id === id);
  if (!current) return undefined;

  const updated: KnowledgeObject = {
    ...parsed,
    id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await writeKnowledgeObjects(items.map((item) => (item.id === id ? updated : item)));
  return updated;
}

export async function deleteKnowledgeObject(id: string): Promise<boolean> {
  const items = await getKnowledgeObjects();
  const nextItems = items.filter((item) => item.id !== id);
  if (nextItems.length === items.length) return false;

  await writeKnowledgeObjects(nextItems);
  return true;
}

export async function getKnowledgeObjectCategories(): Promise<string[]> {
  const items = await getKnowledgeObjects();
  return Array.from(new Set(items.map((item) => item.category))).sort((a, b) => a.localeCompare(b));
}

async function writeKnowledgeObjects(items: KnowledgeObject[]) {
  const sorted = [...items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  await fs.writeFile(knowledgeObjectsPath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
}

function ensureUniqueId(candidateId: string, items: KnowledgeObject[]): string {
  const existingIds = new Set(items.map((item) => item.id));
  if (!existingIds.has(candidateId)) return candidateId;

  let counter = 2;
  let nextId = `${candidateId}-${counter}`;
  while (existingIds.has(nextId)) {
    counter += 1;
    nextId = `${candidateId}-${counter}`;
  }
  return nextId;
}
