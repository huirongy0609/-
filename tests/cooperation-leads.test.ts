import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import test from 'node:test';
import {authorizeCooperationAdmin} from '../lib/cooperation/admin-auth.ts';
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

test('后台记录要求有效签名会话、MFA 与角色权限', () => {
  process.env.COOPERATION_SESSION_SECRET = 'local-test-secret-that-is-at-least-32-characters';
  assert.equal(authorizeCooperationAdmin(new Request('http://localhost'), 'lead:read').status, 'unauthorized');
  const payload = Buffer.from(JSON.stringify({
    sub: 'test-user', email: 'test@example.com', role: 'cooperation_reviewer', mfa: true,
    exp: Math.floor(Date.now() / 1000) + 300,
  })).toString('base64url');
  const signature = createHmac('sha256', process.env.COOPERATION_SESSION_SECRET).update(payload).digest('base64url');
  const request = new Request('http://localhost', {headers: {cookie: `cooperation_admin_session=${payload}.${signature}`}});
  assert.equal(authorizeCooperationAdmin(request, 'lead:read').status, 'authorized');
  assert.equal(authorizeCooperationAdmin(request, 'data:export').status, 'unauthorized');
});
