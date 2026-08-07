import assert from 'node:assert/strict';
import test from 'node:test';
import {roleHasPermission} from '../lib/cooperation/permissions.ts';
import {cooperationLeadSchema} from '../lib/cooperation/schema.ts';

const validInput = {
  organizationName: '测试治理机构',
  contactName: '测试联系人',
  phone: '13800138000',
  city: '四川省成都市',
  wechat: '',
  email: 'test@example.com',
  organizationWebsite: 'https://example.com',
  partnerType: 'property_service_enterprise',
  cooperationDirections: ['trust_property_project', 'content_co_creation'],
  currentStatus: 'exploring_trust_property',
  notes: '仅用于自动化测试。',
  consentDataUse: true,
  websiteConfirmation: '',
} as const;

test('登记字段使用稳定枚举并校验必要信息', () => {
  assert.equal(cooperationLeadSchema.safeParse(validInput).success, true);
  assert.equal(cooperationLeadSchema.safeParse({...validInput, phone: '123'}).success, false);
  assert.equal(cooperationLeadSchema.safeParse({...validInput, cooperationDirections: []}).success, false);
  assert.equal(cooperationLeadSchema.safeParse({...validInput, consentDataUse: false}).success, false);
  assert.equal(cooperationLeadSchema.safeParse({
    ...validInput,
    partnerType: 'technology_service_institution',
  }).success, true);
  assert.equal(cooperationLeadSchema.safeParse({
    ...validInput,
    partnerType: 'training_or_ecosystem_partner',
  }).success, true);
});

test('管理员角色遵守最小权限边界', () => {
  assert.equal(roleHasPermission('cooperation_reviewer', 'lead:read'), true);
  assert.equal(roleHasPermission('cooperation_reviewer', 'data:export'), false);
  assert.equal(roleHasPermission('data_admin', 'data:export'), true);
  assert.equal(roleHasPermission('data_admin', 'lead:review'), false);
  assert.equal(roleHasPermission('super_admin', 'role:manage'), true);
});
