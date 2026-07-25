import {
  metadataList,
  metadataString,
  parseMarkdownMetadata,
} from '../foundation/metadata-parser.ts';

export type ExtractedKnowledgeCenterFields = {
  definition: string | null;
  chapter: string | null;
  legalBasis: string[];
  publishedAt: string | null;
  questions: string[];
};

export function extractKnowledgeCenterFields(
  source: string,
): ExtractedKnowledgeCenterFields {
  const parsed = parseMarkdownMetadata(source);
  const attributes = parsed.attributes;
  const body = parsed.body;

  return {
    definition: metadataString(
      attributes,
      'definition',
      'one_line_definition',
      '一句话定义',
    ) ?? extractDefinition(body),
    chapter: metadataString(
      attributes,
      'chapter',
      'chapter_name',
      '所属章节',
      '主题分类',
    ),
    legalBasis: unique(metadataList(
      attributes,
      'legal_basis',
      'legalBasis',
      '法律依据',
    )),
    publishedAt: metadataString(
      attributes,
      'published_at',
      'publishedAt',
      '发布日期',
    ),
    questions: unique([
      ...metadataList(
        attributes,
        'questions',
        'Questions',
        'question_mapping',
        '用户问题',
      ),
      ...extractQuestions(body),
    ]),
  };
}

function extractDefinition(body: string): string | null {
  const section = extractSection(body, /^(?:#{1,6}\s*)?(?:[一二三四五六七八九十]+[、.]\s*)?一句话定义\s*$/m);
  if (!section) return null;

  const paragraph = section
    .split(/\r?\n\r?\n/)
    .map((value) => plainText(value))
    .find(Boolean);

  return paragraph || null;
}

function extractQuestions(body: string): string[] {
  const section = extractSection(body, /^(?:#{1,6}\s*)?(?:[一二三四五六七八九十]+[、.]\s*)?(?:用户问题|相关问题|Questions?)\s*$/im);
  if (!section) return [];

  return (section
    .replace(/^[-*]\s+/gm, '')
    .match(/[^？?\r\n]+[？?]/g) ?? [])
    .map((value) => plainText(value))
    .filter((value) => /[？?]$/.test(value));
}

function extractSection(body: string, headingPattern: RegExp): string | null {
  const match = headingPattern.exec(body);
  if (!match || match.index === undefined) return null;

  const start = match.index + match[0].length;
  const remainder = body.slice(start).replace(/^\r?\n+/, '');
  const nextHeading = remainder.search(/^#{1,6}\s+/m);
  return (nextHeading >= 0 ? remainder.slice(0, nextHeading) : remainder).trim();
}

function plainText(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`#>|[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
