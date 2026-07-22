export const badgeTokens = {
  JD: {
    label: '词典',
    tone: 'knowledge',
  },
  GT: {
    label: '标准',
    tone: 'standard',
  },
  Case: {
    label: '案例',
    tone: 'case',
  },
  Law: {
    label: '法规',
    tone: 'law',
  },
  Evidence: {
    label: '证据',
    tone: 'evidence',
  },
  Product: {
    label: '产品',
    tone: 'product',
  },
} as const;

export type BadgeKey = keyof typeof badgeTokens;
