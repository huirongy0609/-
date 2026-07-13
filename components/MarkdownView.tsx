import Link from 'next/link';
import type {ReactNode} from 'react';

type MarkdownBlock =
  | {type: 'heading'; level: 1 | 2 | 3; text: string}
  | {type: 'paragraph'; text: string}
  | {type: 'quote'; text: string}
  | {type: 'list'; ordered: boolean; items: string[]}
  | {type: 'code'; text: string}
  | {type: 'table'; rows: string[][]}
  | {type: 'rule'};

export function MarkdownView({source}: {source: string}) {
  const blocks = parseMarkdown(source);

  return (
    <div className="space-y-5 text-[#d7dfdc]">
      {blocks.map((block, index) => (
        <MarkdownBlockView block={block} key={`${block.type}-${index}`} />
      ))}
    </div>
  );
}

function MarkdownBlockView({block}: {block: MarkdownBlock}) {
  if (block.type === 'heading') {
    if (block.level === 1) return <h2 className="pt-5 text-3xl font-semibold leading-tight text-[#f3f6f4]">{renderInline(block.text)}</h2>;
    if (block.level === 2) return <h2 className="pt-4 text-2xl font-semibold leading-tight text-[#f3f6f4]">{renderInline(block.text)}</h2>;
    return <h3 className="pt-3 text-xl font-semibold leading-tight text-[#f3f6f4]">{renderInline(block.text)}</h3>;
  }

  if (block.type === 'list') {
    const List = block.ordered ? 'ol' : 'ul';
    return (
      <List className={`space-y-2 pl-6 text-sm leading-7 text-[#b8c4bf] ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInline(item)}</li>
        ))}
      </List>
    );
  }

  if (block.type === 'quote') {
    return <blockquote className="border-l-2 border-[#4fbda8] pl-4 text-sm leading-7 text-[#b8c4bf]">{renderInline(block.text)}</blockquote>;
  }

  if (block.type === 'code') {
    return (
      <pre className="overflow-x-auto rounded-lg border border-[#2a3431] bg-[#0b1110] p-4 text-xs leading-6 text-[#d7dfdc]">
        <code>{block.text}</code>
      </pre>
    );
  }

  if (block.type === 'table') {
    const [header, ...rows] = block.rows;
    return (
      <div className="overflow-x-auto rounded-lg border border-[#2a3431]">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#0b1110]/70 text-[#f3f6f4]">
            <tr>
              {header.map((cell, index) => (
                <th className="border-b border-[#2a3431] px-4 py-3 font-semibold" key={`${cell}-${index}`}>
                  {renderInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr className="border-b border-[#2a3431] last:border-b-0" key={`row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td className="px-4 py-3 align-top leading-6 text-[#b8c4bf]" key={`${cell}-${cellIndex}`}>
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === 'rule') return <hr className="border-0 border-t border-[#2a3431]" />;

  return <p className="whitespace-pre-line text-sm leading-8 text-[#b8c4bf]">{renderInline(block.text)}</p>;
}

function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({type: 'code', text: code.join('\n')});
      continue;
    }

    if (line === '---' || line === '***') {
      blocks.push({type: 'rule'});
      index += 1;
      continue;
    }

    const heading = readHeading(line);
    if (heading) {
      blocks.push(heading);
      index += 1;
      continue;
    }

    if (line.startsWith('>')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quote.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push({type: 'quote', text: quote.join('\n')});
      continue;
    }

    if (isTableStart(lines, index)) {
      const rows: string[][] = [readTableRow(lines[index])];
      index += 2;
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(readTableRow(lines[index]));
        index += 1;
      }
      blocks.push({type: 'table', rows});
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }
      blocks.push({type: 'list', ordered: false, items});
      continue;
    }

    if (/^\d+[.)、]\s*/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+[.)、]\s*/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+[.)、]\s*/, ''));
        index += 1;
      }
      blocks.push({type: 'list', ordered: true, items});
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isSpecialLine(lines, index)) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({type: 'paragraph', text: paragraph.join('\n')});
  }

  return blocks;
}

function readHeading(line: string): MarkdownBlock | undefined {
  if (line.startsWith('### ')) return {type: 'heading', level: 3, text: line.slice(4)};
  if (line.startsWith('## ')) return {type: 'heading', level: 2, text: line.slice(3)};
  if (line.startsWith('# ')) return {type: 'heading', level: 1, text: line.slice(2)};
  if (/^(?:[一二三四五六七八九十百]+、|【.+】$|版本信息$)/.test(line)) return {type: 'heading', level: 2, text: line};
  return undefined;
}

function isSpecialLine(lines: string[], index: number): boolean {
  const line = lines[index].trim();
  return Boolean(
    readHeading(line) ||
      line === '---' ||
      line === '***' ||
      line.startsWith('```') ||
      line.startsWith('>') ||
      /^[-*]\s+/.test(line) ||
      /^\d+[.)、]\s*/.test(line) ||
      isTableStart(lines, index),
  );
}

function isTableStart(lines: string[], index: number): boolean {
  if (!lines[index]?.trim().startsWith('|') || !lines[index + 1]) return false;
  return /^\|?\s*:?-{3,}/.test(lines[index + 1].trim());
}

function readTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());
}

function renderInline(source: string): ReactNode[] {
  return source.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong className="font-semibold text-[#f3f6f4]" key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code className="rounded bg-[#0b1110] px-1.5 py-0.5 text-xs text-[#9bd8cd]" key={`${part}-${index}`}>
          {part.slice(1, -1)}
        </code>
      );
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <Link className="text-[#9bd8cd] underline decoration-[#4fbda8]/40 underline-offset-4" href={link[2]} key={`${part}-${index}`}>
          {link[1]}
        </Link>
      );
    }

    return part;
  });
}
