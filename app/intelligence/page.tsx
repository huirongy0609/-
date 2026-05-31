import {IntelligenceExplorer} from './IntelligenceExplorer';
import {getIntelligenceViews} from '@/lib/repositories/intelligence';

export default function IntelligencePage() {
  const intelligence = getIntelligenceViews();

  return <IntelligenceExplorer intelligence={intelligence} />;
}
