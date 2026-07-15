import {badgeTokens, type BadgeKey} from '@/lib/design-tokens/badge';

type TagProps = {
  children: React.ReactNode;
  tone?: BadgeKey | 'default';
};

export function Tag({children, tone = 'default'}: TagProps) {
  const token = tone !== 'default' ? badgeTokens[tone] : null;
  return <span className={`platformTag ${token ? `platformTag${token.tone}` : ''}`}>{children}</span>;
}
