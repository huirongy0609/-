import type {ParsedMarkdownMetadata} from "./types.ts";

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  const first = trimmed[0];
  const last = trimmed.at(-1);
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function scalar(value: string): string | boolean | null {
  const normalized = stripWrappingQuotes(value);
  if (normalized === "null" || normalized === "~" || normalized === "") return null;
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return normalized;
}

function inlineList(value: string): unknown[] | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner.split(",").map((item) => scalar(item));
}

function parseFlatYaml(source: string): Record<string, unknown> {
  const attributes: Record<string, unknown> = {};
  let activeList: string | null = null;

  for (const rawLine of source.split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;
    const listItem = rawLine.match(/^\s+-\s+(.+)$/);
    if (listItem && activeList) {
      (attributes[activeList] as unknown[]).push(scalar(listItem[1]));
      continue;
    }

    const property = rawLine.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!property) {
      activeList = null;
      continue;
    }

    const [, key, rawValue] = property;
    if (!rawValue) {
      attributes[key] = [];
      activeList = key;
      continue;
    }

    attributes[key] = inlineList(rawValue) ?? scalar(rawValue);
    activeList = null;
  }

  return attributes;
}

function parseLegacyBlockquote(source: string): Record<string, unknown> {
  const attributes: Record<string, unknown> = {};
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^>\s*\*\*(.+?)[：:]\*\*\s*(.*?)\s{0,2}$/);
    if (match) attributes[match[1].trim()] = match[2].trim();
  }
  return attributes;
}

export function parseMarkdownMetadata(source: string): ParsedMarkdownMetadata {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (frontmatter) {
    return {
      format: "yaml_frontmatter",
      attributes: parseFlatYaml(frontmatter[1]),
      body: source.slice(frontmatter[0].length),
    };
  }

  const attributes = parseLegacyBlockquote(source);
  if (Object.keys(attributes).length > 0) {
    return {format: "legacy_blockquote", attributes, body: source};
  }

  return {format: "none", attributes: {}, body: source};
}

export function metadataString(
  attributes: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = attributes[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export function normalizeNullableId(value: string | null): string | null {
  if (!value || /^(?:未分配|none|null|n\/a)$/i.test(value.trim())) return null;
  return value.replaceAll("`", "").trim();
}

export function normalizeStatus(value: string | null): string | null {
  return value ? value.replaceAll("`", "").trim().toLowerCase() : null;
}
