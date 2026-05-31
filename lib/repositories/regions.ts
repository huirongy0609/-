import 'server-only';

import rawCities from '@/data/cities.json';
import {failure, success, type ApiResponse} from '@/lib/domain/api-response';
import {
  legacyCityRegionDtoListSchema,
  toCityRegionView,
  toRegionEntity,
  type CityRegionView,
  type RegionEntity,
} from '@/lib/domain/region';

function loadRegions(): ApiResponse<RegionEntity[]> {
  const parsed = legacyCityRegionDtoListSchema.safeParse(rawCities);

  if (!parsed.success) {
    return failure('INVALID_REGION_DATA', 'Region mock data failed schema validation.');
  }

  return success(parsed.data.map(toRegionEntity));
}

export function getRegions(): RegionEntity[] {
  const response = loadRegions();

  if (!response.ok) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export function getCityRegionViews(): CityRegionView[] {
  return getRegions().map(toCityRegionView);
}
