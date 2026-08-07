import {z} from 'zod';

export const partnerTypes = [
  'property_service_enterprise',
  'street_or_community',
  'owners_committee',
  'real_estate_developer',
  'government_or_related_institution',
  'industry_expert',
  'technology_service_institution',
  'training_or_ecosystem_partner',
  'other',
] as const;

export const cooperationDirections = [
  'trust_property_project',
  'joint_operation_partner',
  'training_and_certification',
  'consulting_service',
  'study_visit',
  'content_co_creation',
  'technology_platform',
] as const;

export const cooperationStatuses = [
  'implemented_trust_property',
  'exploring_trust_property',
  'learning_about_trust_property',
  'seeking_cooperation',
] as const;

const optionalEmail = z.string().trim().max(120).refine(
  (value) => value === '' || z.email().safeParse(value).success,
  '请填写有效邮箱',
);

const optionalUrl = z.string().trim().max(240).refine(
  (value) => value === '' || z.url().safeParse(value).success,
  '请填写包含 http:// 或 https:// 的完整网址',
);

export const cooperationLeadSchema = z.object({
  organizationName: z.string().trim().min(2, '请填写企业/机构名称').max(120),
  contactName: z.string().trim().min(2, '请填写联系人姓名').max(40),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{6,20}$/, '请填写有效联系电话'),
  city: z.string().trim().min(2, '请填写所在城市').max(80),
  wechat: z.string().trim().max(80).default(''),
  email: optionalEmail.default(''),
  organizationWebsite: optionalUrl.default(''),
  partnerType: z.enum(partnerTypes),
  cooperationDirections: z.array(z.enum(cooperationDirections)).min(1, '请至少选择一个合作方向'),
  currentStatus: z.enum(cooperationStatuses),
  notes: z.string().trim().max(1000).default(''),
  consentDataUse: z.literal(true, {error: '请确认信息使用说明'}),
  websiteConfirmation: z.string().max(0).optional().default(''),
});

export type CooperationLeadInput = z.infer<typeof cooperationLeadSchema>;

export const cooperationLabels = {
  partnerType: {
    property_service_enterprise: '物业服务企业',
    street_or_community: '街道/社区',
    owners_committee: '业主组织（含业主委员会）',
    real_estate_developer: '房地产开发企业',
    government_or_related_institution: '政府及相关机构',
    industry_expert: '行业专家',
    technology_service_institution: '技术服务机构',
    training_or_ecosystem_partner: '培训及生态合作方',
    other: '其他',
  },
  direction: {
    trust_property_project: '信托制物业项目合作',
    joint_operation_partner: '联营伙伴合作',
    training_and_certification: '培训认证合作',
    consulting_service: '咨询服务合作',
    study_visit: '研学考察合作',
    content_co_creation: '内容共建合作',
    technology_platform: '技术平台合作',
  },
  status: {
    implemented_trust_property: '已实施信托制物业',
    exploring_trust_property: '正在探索信托制物业',
    learning_about_trust_property: '希望了解信托制物业',
    seeking_cooperation: '寻求合作机会',
  },
} as const;
