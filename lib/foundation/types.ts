export type MetadataFormat = "yaml_frontmatter" | "legacy_blockquote" | "none";

export const knowledgeObjectTypes = [
  "JD",
  "GT",
  "GT_PACKAGE",
  "CASE",
  "FAQ",
  "LAW",
  "RESEARCH",
  "STANDARD",
  "UNKNOWN",
] as const;

export type KnowledgeObjectType = (typeof knowledgeObjectTypes)[number];

export const packageMemberTypes = ["RULE", "METHOD", "PRINCIPLE", "EVIDENCE"] as const;

export type PackageMemberType = (typeof packageMemberTypes)[number];

export type LifecycleStatusDefinition = {
  id: string;
  foundation_eligible: boolean;
};

export type LifecycleConfig = {
  schema_version: string;
  governance_standard: string;
  statuses: LifecycleStatusDefinition[];
  transitions: Record<string, string[]>;
};

export const relationshipKinds = [
  "RELATED_JD",
  "RELATED_GT",
  "RELATED_GT_PACKAGE",
  "RELATED_CASE",
  "RELATED_FAQ",
  "RELATED_LAW",
] as const;

export type RelationshipKind = (typeof relationshipKinds)[number];

export type KnowledgeRelationship = {
  source_object_id: string;
  target_object_id: string;
  kind: RelationshipKind;
  target_registered: boolean;
};

export type KnowledgeObject = {
  object_id: string;
  candidate_id: string | null;
  foundation_id: string | null;
  object_type: KnowledgeObjectType;
  status: string | null;
  version: string | null;
  source: string[];
  created_at: string | null;
  updated_at: string | null;
  title: string;
  file_path: string | null;
  metadata_format: MetadataFormat;
  foundation_ready: boolean;
  package_id: string | null;
  package_version: string | null;
  parent_object: string | null;
  children: string[];
  package_member_type: PackageMemberType | null;
  relationships: KnowledgeRelationship[];
};

export type GtPackageChildRegistration = {
  object_id: string;
  member_type: PackageMemberType | null;
  registered: boolean;
};

export type GtPackageRegistration = {
  object_id: string;
  package_id: string | null;
  package_version: string | null;
  children: GtPackageChildRegistration[];
};

export type KnowledgeRegistry = {
  schema_version: "1.1";
  generated_at: string | null;
  lifecycle_config: string;
  summary: {
    total: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
    foundation_ready: number;
  };
  objects: KnowledgeObject[];
  packages: GtPackageRegistration[];
};

export type ParsedMarkdownMetadata = {
  format: MetadataFormat;
  attributes: Record<string, unknown>;
  body: string;
};
