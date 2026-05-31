import 'server-only';

import rawCases from '@/data/cases.json';
import {failure, success, type ApiResponse} from '@/lib/domain/api-response';
import {
  legacyCaseDtoListSchema,
  toCaseView,
  toGovernanceCase,
  type CaseView,
  type GovernanceCase,
} from '@/lib/domain/case';

function loadGovernanceCases(): ApiResponse<GovernanceCase[]> {
  const parsed = legacyCaseDtoListSchema.safeParse(rawCases);

  if (!parsed.success) {
    return failure('INVALID_CASE_DATA', 'Case mock data failed schema validation.');
  }

  return success(parsed.data.map(toGovernanceCase));
}

export function getCases(): GovernanceCase[] {
  const response = loadGovernanceCases();

  if (!response.ok) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export function getCaseViews(): CaseView[] {
  return getCases().map(toCaseView);
}

export function getCaseViewById(id: string): CaseView | undefined {
  return getCaseViews().find((caseItem) => caseItem.id === id);
}
