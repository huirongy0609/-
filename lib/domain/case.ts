import {z} from 'zod';

export const reviewStatusSchema = z.enum(['approved', 'reviewing', 'rejected']);

export const legacyCaseDtoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  submitter: z.string().min(1),
  subjectType: z.string().min(1),
  communityType: z.string().min(1),
  problem: z.string().min(1),
  model: z.string().min(1),
  actions: z.array(z.string().min(1)),
  result: z.string().min(1),
  risks: z.array(z.string().min(1)),
  tags: z.array(z.string().min(1)),
  publishedAt: z.string().min(1),
  status: reviewStatusSchema,
});

export const legacyCaseDtoListSchema = z.array(legacyCaseDtoSchema);

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type LegacyCaseDto = z.infer<typeof legacyCaseDtoSchema>;

export type GovernanceCase = {
  id: string;
  title: string;
  region: {
    city: string;
    district: string;
  };
  submitter: {
    name: string;
    subjectType: string;
  };
  communityType: string;
  problem: string;
  governanceModel: string;
  actions: string[];
  result: string;
  risks: string[];
  tags: string[];
  publishedAt: string;
  reviewStatus: ReviewStatus;
};

export type CaseView = LegacyCaseDto;

export function toGovernanceCase(dto: LegacyCaseDto): GovernanceCase {
  return {
    id: dto.id,
    title: dto.title,
    region: {
      city: dto.city,
      district: dto.district,
    },
    submitter: {
      name: dto.submitter,
      subjectType: dto.subjectType,
    },
    communityType: dto.communityType,
    problem: dto.problem,
    governanceModel: dto.model,
    actions: dto.actions,
    result: dto.result,
    risks: dto.risks,
    tags: dto.tags,
    publishedAt: dto.publishedAt,
    reviewStatus: dto.status,
  };
}

export function toCaseView(domainCase: GovernanceCase): CaseView {
  return {
    id: domainCase.id,
    title: domainCase.title,
    city: domainCase.region.city,
    district: domainCase.region.district,
    submitter: domainCase.submitter.name,
    subjectType: domainCase.submitter.subjectType,
    communityType: domainCase.communityType,
    problem: domainCase.problem,
    model: domainCase.governanceModel,
    actions: domainCase.actions,
    result: domainCase.result,
    risks: domainCase.risks,
    tags: domainCase.tags,
    publishedAt: domainCase.publishedAt,
    status: domainCase.reviewStatus,
  };
}
