import {z} from 'zod';

export const intelligenceCategorySchema = z.enum(['政策动态', '城市案例', '上市物业', '舆情风险', '招投标', '行业趋势']);

export const aiSummaryStatusSchema = z.enum(['pending', 'generated', 'failed', 'needs_review']);

export const legacyIntelligenceDtoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: intelligenceCategorySchema,
  region: z.string().min(1),
  city: z.string(),
  source: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)),
  publishedAt: z.string().min(1),
  url: z.string().min(1),
  aiSummaryStatus: aiSummaryStatusSchema,
});

export const legacyIntelligenceDtoListSchema = z.array(legacyIntelligenceDtoSchema);

export type IntelligenceCategory = z.infer<typeof intelligenceCategorySchema>;
export type AiSummaryStatus = z.infer<typeof aiSummaryStatusSchema>;
export type LegacyIntelligenceDto = z.infer<typeof legacyIntelligenceDtoSchema>;

export type IntelligenceEntity = {
  id: string;
  title: string;
  category: IntelligenceCategory;
  region: {
    name: string;
    city: string;
  };
  source: {
    name: string;
    url: string;
  };
  summary: string;
  tags: string[];
  publishedAt: string;
  aiSummaryStatus: AiSummaryStatus;
};

export type IntelligenceView = LegacyIntelligenceDto;

export function toIntelligenceEntity(dto: LegacyIntelligenceDto): IntelligenceEntity {
  return {
    id: dto.id,
    title: dto.title,
    category: dto.category,
    region: {
      name: dto.region,
      city: dto.city,
    },
    source: {
      name: dto.source,
      url: dto.url,
    },
    summary: dto.summary,
    tags: dto.tags,
    publishedAt: dto.publishedAt,
    aiSummaryStatus: dto.aiSummaryStatus,
  };
}

export function toIntelligenceView(entity: IntelligenceEntity): IntelligenceView {
  return {
    id: entity.id,
    title: entity.title,
    category: entity.category,
    region: entity.region.name,
    city: entity.region.city,
    source: entity.source.name,
    summary: entity.summary,
    tags: entity.tags,
    publishedAt: entity.publishedAt,
    url: entity.source.url,
    aiSummaryStatus: entity.aiSummaryStatus,
  };
}
