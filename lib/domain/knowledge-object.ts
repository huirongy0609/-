import {z} from 'zod';

export const knowledgeObjectTypeSchema = z.enum(['JD', 'GT', 'Article']);

export const knowledgeObjectStatusSchema = z.enum(['Draft', 'Review', 'Approved', 'Superseded', 'Archived']);

export const knowledgeObjectSchema = z.object({
  id: z.string().min(1),
  type: knowledgeObjectTypeSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  category: z.string().min(1),
  version: z.string().min(1).default('v0.1'),
  status: knowledgeObjectStatusSchema.default('Draft'),
  references: z.array(z.string().min(1)).default([]),
  evidenceRefs: z.array(z.string().min(1)).default([]),
  body: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const knowledgeObjectListSchema = z.array(knowledgeObjectSchema);

export const knowledgeObjectInputSchema = knowledgeObjectSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: z.string().min(1).optional(),
  });

export type KnowledgeObjectType = z.infer<typeof knowledgeObjectTypeSchema>;
export type KnowledgeObjectStatus = z.infer<typeof knowledgeObjectStatusSchema>;
export type KnowledgeObject = z.infer<typeof knowledgeObjectSchema>;
export type KnowledgeObjectInput = z.infer<typeof knowledgeObjectInputSchema>;

export const knowledgeObjectTypeLabels: Record<KnowledgeObjectType, string> = {
  JD: '治理词典',
  GT: '治理工具',
  Article: '文章',
};

export function createKnowledgeObjectId(type: KnowledgeObjectType, title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-\u4e00-\u9fa5]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return `${type.toLowerCase()}-${base || Date.now()}`;
}
