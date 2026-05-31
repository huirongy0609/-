import 'server-only';

import {failure, success, type ApiResponse} from '@/lib/domain/api-response';
import {
  legacySubmissionDtoSchema,
  toSubmissionEntity,
  toSubmissionView,
  type SubmissionEntity,
  type SubmissionView,
} from '@/lib/domain/submission';

function createSubmissionId(createdAt: string): string {
  return `submission_${createdAt.replace(/[-:.TZ]/g, '')}`;
}

export function createSubmissionDraft(input: unknown): ApiResponse<SubmissionView> {
  const parsed = legacySubmissionDtoSchema.safeParse(input);

  if (!parsed.success) {
    return failure('INVALID_SUBMISSION_DATA', 'Submission data failed schema validation.');
  }

  const createdAt = new Date().toISOString();
  const entity: SubmissionEntity = toSubmissionEntity(parsed.data, {
    id: createSubmissionId(createdAt),
    createdAt,
  });

  return success(toSubmissionView(entity));
}
