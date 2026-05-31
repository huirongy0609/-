import {z} from 'zod';

export const organizationTypeSchema = z.enum([
  '社工机构',
  '物业公司',
  '业委会',
  '街道/社区',
  '专家顾问',
  '服务商',
  '研究机构',
  '其他',
]);

export const submissionTypeSchema = z.enum(['提交案例', '提交政策线索', '提交城市动态', '提交舆情线索', '申请加入城市共建']);

export const submissionReviewStatusSchema = z.enum(['submitted', 'reviewing', 'approved', 'rejected', 'converted']);

export const legacySubmissionDtoSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  organizationName: z.string().min(1),
  organizationType: organizationTypeSchema,
  city: z.string().min(1),
  district: z.string(),
  submissionType: submissionTypeSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  relatedUrl: z.string(),
  attachmentRefs: z.array(z.string().min(1)),
  consentToPublishAfterReview: z.boolean(),
});

export type OrganizationType = z.infer<typeof organizationTypeSchema>;
export type SubmissionType = z.infer<typeof submissionTypeSchema>;
export type SubmissionReviewStatus = z.infer<typeof submissionReviewStatusSchema>;
export type LegacySubmissionDto = z.infer<typeof legacySubmissionDtoSchema>;

export type SubmissionEntity = {
  id: string;
  submitter: {
    name: string;
    phone: string;
  };
  organization: {
    name: string;
    type: OrganizationType;
  };
  region: {
    city: string;
    district: string;
  };
  submissionType: SubmissionType;
  title: string;
  description: string;
  relatedUrl: string;
  attachmentRefs: string[];
  consentToPublishAfterReview: boolean;
  reviewStatus: SubmissionReviewStatus;
  createdAt: string;
};

export type SubmissionView = LegacySubmissionDto & {
  id: string;
  reviewStatus: SubmissionReviewStatus;
  createdAt: string;
};

export function toSubmissionEntity(dto: LegacySubmissionDto, metadata: {id: string; createdAt: string}): SubmissionEntity {
  return {
    id: metadata.id,
    submitter: {
      name: dto.name,
      phone: dto.phone,
    },
    organization: {
      name: dto.organizationName,
      type: dto.organizationType,
    },
    region: {
      city: dto.city,
      district: dto.district,
    },
    submissionType: dto.submissionType,
    title: dto.title,
    description: dto.description,
    relatedUrl: dto.relatedUrl,
    attachmentRefs: dto.attachmentRefs,
    consentToPublishAfterReview: dto.consentToPublishAfterReview,
    reviewStatus: 'submitted',
    createdAt: metadata.createdAt,
  };
}

export function toSubmissionView(entity: SubmissionEntity): SubmissionView {
  return {
    id: entity.id,
    name: entity.submitter.name,
    phone: entity.submitter.phone,
    organizationName: entity.organization.name,
    organizationType: entity.organization.type,
    city: entity.region.city,
    district: entity.region.district,
    submissionType: entity.submissionType,
    title: entity.title,
    description: entity.description,
    relatedUrl: entity.relatedUrl,
    attachmentRefs: entity.attachmentRefs,
    consentToPublishAfterReview: entity.consentToPublishAfterReview,
    reviewStatus: entity.reviewStatus,
    createdAt: entity.createdAt,
  };
}
