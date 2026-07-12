import type {ReactNode} from 'react';

export function MarkdownView({source}: {source: string}) {
  const blocks = source.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="space-y-5 text-[#d7dfdc]">
      {blocks.map((block, index) => (
        <MarkdownBlock block={block} key={`${block.slice(0, 24)}-${index}`} />
      ))}
    </div>
  );
}

function MarkdownBlock({block}: {block: string}) {
  if (block.startsWith('### ')) {
    return <h3 className="pt-2 text-xl font-semibold text-[#f3f6f4]">{block.slice(4)}</h3>;
  }

  if (block.startsWith('## ')) {
    return <h2 className="pt-3 text-2xl font-semibold text-[#f3f6f4]">{block.slice(3)}</h2>;
  }

  if (block.startsWith('# ')) {
    return <h1 className="pt-3 text-3xl font-semibold text-[#f3f6f4]">{block.slice(2)}</h1>;
  }

  if (block.split('\n').every((line) => line.startsWith('- '))) {
    return (
      <ul className="space-y-2 pl-5 text-sm leading-7 text-[#b8c4bf]">
        {block.split('\n').map((line) => (
          <li className="list-disc" key={line}>
            {renderInline(line.slice(2))}
          </li>
        ))}
      </ul>
    );
  }

  if (block.startsWith('> ')) {
    return (
      <blockquote className="border-l-2 border-[#4fbda8] pl-4 text-sm leading-7 text-[#b8c4bf]">
        {renderInline(block.replace(/^>\s?/gm, ''))}
      </blockquote>
    );
  }

  return <p className="text-sm leading-8 text-[#b8c4bf]">{renderInline(block)}</p>;
}

function renderInline(source: string): ReactNode[] {
  return source.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong className="font-semibold text-[#f3f6f4]" key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}
