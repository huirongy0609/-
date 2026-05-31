import 'server-only';

import rawIntelligence from '@/data/intelligence.json';
import {failure, success, type ApiResponse} from '@/lib/domain/api-response';
import {
  legacyIntelligenceDtoListSchema,
  toIntelligenceEntity,
  toIntelligenceView,
  type IntelligenceEntity,
  type IntelligenceView,
} from '@/lib/domain/intelligence';

function loadIntelligenceEntities(): ApiResponse<IntelligenceEntity[]> {
  const parsed = legacyIntelligenceDtoListSchema.safeParse(rawIntelligence);

  if (!parsed.success) {
    return failure('INVALID_INTELLIGENCE_DATA', 'Intelligence mock data failed schema validation.');
  }

  return success(parsed.data.map(toIntelligenceEntity));
}

export function getIntelligenceItems(): IntelligenceEntity[] {
  const response = loadIntelligenceEntities();

  if (!response.ok) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export function getIntelligenceViews(): IntelligenceView[] {
  return getIntelligenceItems().map(toIntelligenceView);
}
