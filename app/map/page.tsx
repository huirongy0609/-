import {CityRuntimeLayer} from '@/components/CityRuntimeLayer';
import stats from '@/data/stats.json';
import {getCityRegionViews} from '@/lib/repositories/regions';

export default function MapPage() {
  const cities = getCityRegionViews();

  return <CityRuntimeLayer cities={cities} stats={stats} />;
}
