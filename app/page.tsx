import stats from '@/data/stats.json';
import {HomeCommandCenter} from '@/components/HomeCommandCenter';

const commandMetrics = [
  {label: '已接入城市', value: stats.cityCount, helper: '全国治理节点'},
  {label: '治理案例', value: stats.caseCount, helper: '结构化沉淀'},
  {label: '今日AI情报', value: stats.todayIntelligence, helper: '政策 / 舆情 / 案例'},
  {label: '共建机构', value: stats.organizationCount, helper: '跨主体协同'},
  {label: '政策动态', value: stats.policyCount, helper: '持续追踪'},
];

export default function HomePage() {
  return <HomeCommandCenter commandMetrics={commandMetrics} />;
}
