import {z} from 'zod';

export const regionStatusSchema = z.enum(['active', 'pending']);

export const legacyCityRegionDtoSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  province: z.string().min(1),
  caseCount: z.number().int().nonnegative(),
  policyCount: z.number().int().nonnegative(),
  organizationCount: z.number().int().nonnegative(),
  status: regionStatusSchema,
  latestUpdate: z.string().min(1),
  tags: z.array(z.string().min(1)),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

export const legacyCityRegionDtoListSchema = z.array(legacyCityRegionDtoSchema);

export type RegionStatus = z.infer<typeof regionStatusSchema>;
export type LegacyCityRegionDto = z.infer<typeof legacyCityRegionDtoSchema>;

export type RegionEntity = {
  id: string;
  name: string;
  type: 'city';
  parentRegion: {
    name: string;
    type: 'province';
  };
  status: RegionStatus;
  metrics: {
    caseCount: number;
    policyCount: number;
    organizationCount: number;
  };
  latestUpdate: string;
  tags: string[];
  displayCoordinate: {
    x: number;
    y: number;
  };
};

export type CityRegionView = LegacyCityRegionDto;

export function toRegionEntity(dto: LegacyCityRegionDto): RegionEntity {
  return {
    id: dto.id,
    name: dto.name,
    type: 'city',
    parentRegion: {
      name: dto.province,
      type: 'province',
    },
    status: dto.status,
    metrics: {
      caseCount: dto.caseCount,
      policyCount: dto.policyCount,
      organizationCount: dto.organizationCount,
    },
    latestUpdate: dto.latestUpdate,
    tags: dto.tags,
    displayCoordinate: {
      x: dto.x,
      y: dto.y,
    },
  };
}

export function toCityRegionView(entity: RegionEntity): CityRegionView {
  return {
    id: entity.id,
    name: entity.name,
    province: entity.parentRegion.name,
    caseCount: entity.metrics.caseCount,
    policyCount: entity.metrics.policyCount,
    organizationCount: entity.metrics.organizationCount,
    status: entity.status,
    latestUpdate: entity.latestUpdate,
    tags: entity.tags,
    x: entity.displayCoordinate.x,
    y: entity.displayCoordinate.y,
  };
}
