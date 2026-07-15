export type MetadataFormat = "yaml_frontmatter" | "legacy_blockquote" | "none";

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
  object_type: string;
  status: string | null;
  version: string | null;
  source: string[];
  created_at: string | null;
  updated_at: string | null;
  title: string;
  file_path: string | null;
  metadata_format: MetadataFormat;
  foundation_ready: boolean;
  relationships: KnowledgeRelationship[];
};

export type KnowledgeRegistry = {
  schema_version: "1.0";
  generated_at: string | null;
  lifecycle_config: string;
  summary: {
    total: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
    foundation_ready: number;
  };
  objects: KnowledgeObject[];
};

export type ParsedMarkdownMetadata = {
  format: MetadataFormat;
  attributes: Record<string, unknown>;
  body: string;
};
